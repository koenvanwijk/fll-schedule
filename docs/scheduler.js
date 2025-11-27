// GitHub repository info
const GITHUB_OWNER = 'koenvanwijk';
const GITHUB_REPO = 'ffl-schedule';

document.getElementById('schedulerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        num_teams: document.getElementById('numTeams').value,
        num_tables: document.getElementById('numTables').value,
        num_jury_rooms: document.getElementById('numJuryRooms').value,
        matches_per_team: document.getElementById('matchesPerTeam').value,
        num_timeslots: document.getElementById('numTimeslots').value,
        start_time: document.getElementById('startTime').value,
        match_duration: document.getElementById('matchDuration').value,
        jury_duration: document.getElementById('juryDuration').value,
        buffer_time: document.getElementById('bufferTime').value,
        break_enabled: document.getElementById('breakEnabled').value === 'true' ? 'Ja' : 'Nee',
        break_start_time: document.getElementById('breakStartTime').value,
        break_duration: document.getElementById('breakDuration').value
    };
    
    console.log('Form data:', formData);
    
    createIssue(formData);
});

function createIssue(params) {
    // Create issue body with parameters - compact format to avoid URL length limits
    const issueTitle = `Schema: ${params.num_teams}T ${params.num_tables}Taf ${params.matches_per_team}W`;
    const issueBody = `## Toernooi Configuratie

**Teams:** ${params.num_teams}
**Tafels:** ${params.num_tables}
**Jury Rooms:** ${params.num_jury_rooms}
**Wedstrijden per team:** ${params.matches_per_team}
**Tijdsloten:** ${params.num_timeslots}
**Start tijd:** ${params.start_time}
**Wedstrijd duur:** ${params.match_duration} min
**Jury duur:** ${params.jury_duration} min
**Buffer tijd:** ${params.buffer_time} min
**Pauze:** ${params.break_enabled}
**Pauze start:** ${params.break_start_time} min
**Pauze duur:** ${params.break_duration} min`;

    // URL encode the title and body
    const encodedTitle = encodeURIComponent(issueTitle);
    const encodedBody = encodeURIComponent(issueBody);
    
    // Create GitHub issue URL (without labels - wordt automatisch toegevoegd)
    const issueUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new?title=${encodedTitle}&body=${encodedBody}`;
    
    // Debug: log de URL lengte en body
    console.log('Issue URL length:', issueUrl.length);
    console.log('Issue body:', issueBody);
    console.log('Full URL:', issueUrl);
    
    // Show success message with link
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `
        <strong>✅ Klaar om schema aan te vragen!</strong><br><br>
        <p>Klik op de knop hieronder om een GitHub issue te maken.<br>
        De scheduler start automatisch en het resultaat wordt als artifact toegevoegd.</p>
        <a href="${issueUrl}" target="_blank" class="download-link" style="margin-top: 15px;">
            📝 Maak Issue & Start Scheduler
        </a>
        <br><br>
        <small>💡 Je kunt de status volgen in de GitHub Actions tab</small>
    `;
    statusDiv.className = 'status success';
}
