<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Ticket::with(['user', 'comments']);
        
        // Customers see only their tickets, Admins see all
        if ($user->role === 'customer') {
            $query->where('user_id', $user->id);
        }
        
        $tickets = $query->orderBy('created_at', 'desc')->get();
        
        return response()->json($tickets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'subject' => $validated['subject'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'priority' => $validated['priority'],
            'status' => 'open',
        ]);

        return response()->json($ticket->load('user'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        
        $ticket = Ticket::with(['user', 'comments.user'])->findOrFail($id);
        
        // Customers can only view their own tickets
        if ($user->role === 'customer' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json($ticket);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $ticket = Ticket::findOrFail($id);
        
        // Customers can only update their own tickets
        if ($user->role === 'customer' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'subject' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string|max:255',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'status' => 'sometimes|in:open,in_progress,resolved,closed',
        ]);

        // Only admins can change status
        if ($user->role !== 'admin' && isset($validated['status'])) {
            unset($validated['status']);
        }

        $ticket->update($validated);
        
        return response()->json($ticket->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $ticket = Ticket::findOrFail($id);
        
        // Customers can only delete their own tickets
        if ($user->role === 'customer' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ticket->delete();
        
        return response()->json(['message' => 'Ticket deleted successfully']);
    }
}
