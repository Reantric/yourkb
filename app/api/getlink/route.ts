import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('kilobytes')
        .select()
        .eq('user_id', user.id);

    if (error) {
        console.log(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({body: data[0].id}, { status: 200 });
}