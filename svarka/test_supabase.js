
const { createClient } = require('@supabase/supabase-js');

// User's provided URL (without 'y')
const supabaseUrl = 'https://nououcgjlnhhulxgdqrj.supabase.co';
// original key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdW91Y2dqbG5oaHVseGdkcXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyOTk4NzgsImV4cCI6MjA4Njg3NTg3OH0.KSJMIDB0iebVEWspTj0fLebYRxvSMYs57U3fhu5-ekw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log("Testing connection to:", supabaseUrl);

    // 1. Try to select from services
    const { data, error } = await supabase.from('services').select('*');

    if (error) {
        console.error("❌ Connection Failed or Query Failed!");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Error Details:", error.details);
        console.error("Error Hint:", error.hint);
    } else {
        console.log("✅ Connection Successful!");
        console.log("Rows found:", data.length);
        console.log("First row:", data[0]);
    }
}

testConnection();
