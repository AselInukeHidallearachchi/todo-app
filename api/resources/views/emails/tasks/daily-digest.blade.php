@component('mail::message')
# Hello {{ $user->name }},

Here’s your daily task digest.

## Due Today
@forelse($tasks['due_today'] as $t)
- {{ $t->title }} ({{ ucfirst($t->priority) }})
@empty
_No tasks due today_
@endforelse

## Upcoming (next 7 days)
@forelse($tasks['upcoming'] as $t)
- {{ $t->title }} — Due {{ optional($t->due_date)->format('M d') }}
@empty
_No upcoming tasks_
@endforelse

## Overdue
@forelse($tasks['overdue'] as $t)
- {{ $t->title }} — Due {{ optional($t->due_date)->format('M d') }}
@empty
_No overdue tasks_
@endforelse

@component('mail::button', ['url' => config('app.frontend_url').'/tasks'])
Open Tasks
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
