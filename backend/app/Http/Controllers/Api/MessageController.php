<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Ticket;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display messages for a specific ticket.
     */
    public function index(Request $request, $ticketId)
    {
        $user = $request->user();
        
        // Check if user has access to this ticket
        $ticket = Ticket::findOrFail($ticketId);
        
        if ($user->role === 'customer' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $messages = Message::with('user')
            ->where('ticket_id', $ticketId)
            ->orderBy('created_at', 'asc')
            ->get();
        
        return response()->json($messages);
    }

    /**
     * Store a newly created message.
     */
    public function store(Request $request, $ticketId)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);
        
        $user = $request->user();
        
        // Check if user has access to this ticket
        $ticket = Ticket::findOrFail($ticketId);
        
        if ($user->role === 'customer' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $message = Message::create([
            'ticket_id' => $ticketId,
            'user_id' => $user->id,
            'message' => $validated['message'],
        ]);
        
        return response()->json($message->load('user'), 201);
    }
}
