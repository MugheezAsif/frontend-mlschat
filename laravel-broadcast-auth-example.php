<?php
// This is an example Laravel controller for broadcasting authentication
// Add this to your Laravel backend

// In routes/web.php or routes/api.php, add:
// Route::post('/broadcasting/auth', [BroadcastAuthController::class, 'authenticate']);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Broadcasting\BroadcastController;

class BroadcastAuthController extends Controller
{
    public function authenticate(Request $request)
    {
        // For testing purposes, you can allow all connections
        // In production, add proper authentication logic
        
        // Get the channel name from the request
        $channelName = $request->input('channel_name');
        
        // For public channels, no authentication needed
        if (!str_starts_with($channelName, 'private-') && !str_starts_with($channelName, 'presence-')) {
            return response()->json(['auth' => '']);
        }
        
        // For private/presence channels, add your authentication logic
        // Example:
        // $user = auth()->user();
        // if (!$user) {
        //     return response()->json(['message' => 'Unauthorized'], 401);
        // }
        
        // For now, allow all private channels for testing
        $socketId = $request->input('socket_id');
        $auth = hash_hmac('sha256', $socketId . ':' . $channelName, config('broadcasting.connections.reverb.secret'));
        
        return response()->json([
            'auth' => config('broadcasting.connections.reverb.key') . ':' . $auth
        ]);
    }
}
