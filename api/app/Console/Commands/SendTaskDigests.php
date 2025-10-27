<?php

namespace App\Console\Commands;

use App\Mail\DailyTaskDigest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class SendTaskDigests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:send-digests';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily task digests to users at their chosen time';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        info("Task digest command is executing");
        $now = Carbon::now(); // Uses APP_TIMEZONE (e.g. Asia/Colombo)

        //logging the server time. 
        info('current time'.$now);

        $windowStart = $now->copy()->subMinutes(2)->format('H:i:s');
        $windowEnd   = $now->copy()->addMinutes(2)->format('H:i:s');

        // Get users whose digest time falls within the 4-minute window
        $users = User::whereHas('preference', function ($q) use ($windowStart, $windowEnd) {
            $q->where('daily_digest_enabled', true)
              ->whereBetween('digest_time', [$windowStart, $windowEnd]);
        })->get();

        /*
        // TESTING CODE (used to send to all enabled users regardless of time)
        // Commented out above and uncomment below for testing. 
        // */
        
        // $users = User::whereHas('preference', function ($q) {
        //     $q->where('daily_digest_enabled', true);
        // })->get();
        

        foreach ($users as $user) {
            // Prevent double-send for the same day COMMENT TO TEST
            // $key = "digest:{$user->id}:" . today()->toDateString();
            // if (Cache::has($key)) {
            //     $this->info("Skipped {$user->email} (already sent today)");
            //     continue;
            // }

            // Collect tasks
            $tasks = [
                'due_today' => $user->tasks()
                    ->whereDate('due_date', today())
                    ->orderBy('priority')
                    ->get(),
                'upcoming' => $user->tasks()
                    ->whereBetween('due_date', [today()->addDay(), today()->addDays(7)])
                    ->orderBy('due_date')
                    ->get(),
                'overdue' => $user->tasks()
                    ->whereDate('due_date', '<', today())
                    ->where('status', '!=', 'completed')
                    ->orderBy('due_date')
                    ->get(),
            ];

            // Send email
            Mail::to($user->email)->send(new DailyTaskDigest($user, $tasks));

            // Mark as sent for the day COMMENT TO TEST
            //Cache::put($key, true, now()->endOfDay());

            $this->info("Sent digest to {$user->email}");
        }

        // Log if no users matched this run
        if ($users->isEmpty()) {
            $this->info('No users matched the current digest window.');
        }

        return self::SUCCESS;
    }
}
