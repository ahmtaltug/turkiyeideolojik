import { isStatsEnabled, parseSubmission, recordSubmission } from '@/lib/stats';

// Receives an explicitly consented, anonymous result ({ ideology, mode }) and
// increments aggregate counters. Nothing identifying is read or stored here:
// no IP address, headers, cookies or answers are used.
export async function POST(request: Request) {
    if (!isStatsEnabled()) {
        return Response.json({ ok: false, error: 'disabled' }, { status: 503 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ ok: false, error: 'invalid' }, { status: 400 });
    }

    const submission = parseSubmission(body);
    if (!submission) {
        return Response.json({ ok: false, error: 'invalid' }, { status: 400 });
    }

    try {
        await recordSubmission(submission);
    } catch {
        return Response.json({ ok: false, error: 'unavailable' }, { status: 503 });
    }
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
