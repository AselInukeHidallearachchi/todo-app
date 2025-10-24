<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DailyTaskDigest extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $tasks; // array containing due_today, upcoming, overdue

    /**
     * Create a new message instance.
     */
    public function __construct($user, array $tasks)
    {
        $this->user = $user;
        $this->tasks = $tasks;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Your Daily Task Digest')
            ->markdown('emails.tasks.daily-digest', [
                'user' => $this->user,
                'tasks' => $this->tasks,
            ]);
    }
}
