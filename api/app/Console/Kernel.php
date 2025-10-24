<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        \App\Console\Commands\SendTaskDigests::class,
    ];

    /**
     * Define the application's command schedule.
     */
   protected function schedule(Schedule $schedule): void
{
    // Run digest every minute
    $schedule->command('tasks:send-digests')
             ->everyMinute()
             ->withoutOverlapping();

    // Test dummy command to verify scheduler is working
    $schedule->call(function () {
        \Log::info('✅ Scheduler is running fine at: ' . now());
    })->everyMinute();
}


    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
