<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Webhook endpoint for BBB events
 *
 * @package    block_bbb_session_monitor
 * @copyright  2024 Your Name
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once('../../config.php');
require_once('classes/session_manager.php');

// Disable Moodle's session handling for webhooks
define('NO_MOODLE_COOKIES', true);

// Get webhook configuration
$webhook_secret = get_config('block_bbb_session_monitor', 'webhook_secret');
$allowed_ips = get_config('block_bbb_session_monitor', 'allowed_ips');

// Verify IP address if configured
if (!empty($allowed_ips)) {
    $client_ip = $_SERVER['REMOTE_ADDR'];
    $allowed_ips_array = explode(',', $allowed_ips);
    $allowed_ips_array = array_map('trim', $allowed_ips_array);
    
    if (!in_array($client_ip, $allowed_ips_array)) {
        http_response_code(403);
        die('Access denied');
    }
}

// Get request body
$input = file_get_contents('php://input');
$headers = getallheaders();

// Verify webhook signature if secret is configured
if (!empty($webhook_secret)) {
    $signature = $headers['X-BBB-Signature'] ?? '';
    $expected_signature = hash_hmac('sha256', $input, $webhook_secret);
    
    if (!hash_equals($expected_signature, $signature)) {
        http_response_code(401);
        die('Invalid signature');
    }
}

// Parse webhook data
$webhook_data = json_decode($input, true);

if (!$webhook_data) {
    http_response_code(400);
    die('Invalid JSON');
}

// Process the webhook
try {
    $session_manager = new \block_bbb_session_monitor\session_manager();
    
    $event_type = $webhook_data['event'] ?? '';
    $event_data = $webhook_data['data'] ?? [];
    
    $success = $session_manager->process_webhook_event($event_type, $event_data);
    
    if ($success) {
        http_response_code(200);
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Processing failed']);
    }
    
} catch (Exception $e) {
    error_log('BBB Webhook Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal error']);
}
