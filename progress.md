# FLL Schedule Project - Progress Overview

## Volledige lijst van uitgevoerde stappen

### Fase 0: Project Setup & Basis Scheduler

#### 0.1 Initiele Requirements
**Vraag:** "Ik heb tussen de 10-40 first lego league teams die verdeeld moeten worden over 4 tot 10 tafels. Ze moeten allemaal 4 wedstrijden spelen"
**Constraints:**
- Teams moeten ook naar jury sessies
- Tafels werken in paren (beide tafels bezet of beide leeg)
- Alle wedstrijden in een ronde moeten tegelijk starten
- Teams moeten tegen unieke tegenstanders spelen
- Teams moeten op zoveel mogelijk verschillende tafels spelen
- Minimale buffer tijd tussen activiteiten voor een team

#### 0.2 Technologie Keuze
**Gekozen:** Google OR-Tools CP-SAT solver
**Reden:** 
- Krachtige constraint programming solver
- Geschikt voor complex scheduling met meerdere constraints
- Python bibliotheek beschikbaar
- Gratis en open source

#### 0.3 Omgeving Setup
**Aangemaakt:**
- Conda environment 'ffl' met Python 3.11
- Geïnstalleerde packages: ortools (9.14.6206), numpy, pandas

#### 0.4 Basis Scheduler Ontwikkeling
**Bestanden aangemaakt:**
- `config.py` - Configuratie parameters
- `complete_scheduler.py` - Hoofdscheduler met CP-SAT
- `test_schedule.py` - Validatie script

**Geïmplementeerde constraints:**
1. Match assignment: Elk team speelt exact N wedstrijden
2. Jury assignment: Elk team heeft 1 jury sessie
3. No overlap: Team kan niet op 2 plekken tegelijk zijn
4. Buffer time: Minimale tijd tussen activiteiten
5. Unique opponents: Teams spelen tegen verschillende tegenstanders
6. Table pairs: Gepaarde tafels altijd samen bezet/leeg
7. Synchronized rounds: Alle matches in een ronde starten tegelijk
8. Table variety: Teams spelen op zoveel mogelijk verschillende tafels
9. Jury room distribution: Eerlijk verdelen over jury rooms
10. Break handling: Pauze in output (niet als constraint)

#### 0.5 JSON Output Formaat Implementatie
**Vraag:** "Hier heb ik het output formaat dat eruit moet komen" (schedule-2025-11-21T13-32-45.json)
**Analyse van voorbeeld JSON:**
- Complex formaat met matches, jury sessions, table timeslots
- Team allocations voor zowel matches als jury
- Tijdstempels en duraties in minuten
- Gestructureerde lists per resource (tafels, jury rooms, teams)

**Stappen:**
1. **generate_json.py aangemaakt** - Eerste poging om JSON formaat te genereren
2. **quick_schedule.py aangemaakt** - CLI tool met --json flag
3. **complete_scheduler.py ontwikkeld** - Volledige scheduler die:
   - Beide soorten activiteiten plant (matches + jury)
   - JSON output genereert in correct formaat
   - Alle constraints respecteert
   - Validatie bevat

**Test resultaat:**
- 40 teams, elk met 4 matches + 1 jury sessie
- Elk team speelt op slechts 1 tafel (optimaal!)
- JSON output: `schedule-complete-2025-11-27T14-27-53.json`
- Alle secties aanwezig: matchList, jurySessionList, tableTimeslotList, teamMatchAllocationList, teamJuryAllocationList

#### 0.6 Eerste Werkende Versie
**Output:**
- JSON bestand met volledig schema in correct formaat
- Matches met tijden, tafels, teams
- Jury sessies met tijden, rooms, teams  
- Validatie tests (alle constraints gecontroleerd)

### Fase 1: Break/Pauze Fix

#### 1.1 Pauze Probleem
**Probleem:** Wedstrijden werden ingepland tijdens de pauze (168-203 minuten)
**Oplossing:** 
- BREAK_DURATION verhoogd van 30 naar 35 minuten
- Dit zorgt ervoor dat 5 volledige timeslots (5 × 7 min = 35 min) worden geblokkeerd
- Timeslot 24 (168 min) wordt nu correct overgeslagen

### Fase 2: Hosting Oplossing - GitHub Pages + Actions

#### 2.1 Hosting Onderzoek
**Vraag:** Bestaat er nog een free tier op App Engine?
**Antwoord:** Nee, niet meer. Alternatief: GitHub Pages + GitHub Actions (100% gratis)
**Gekozen aanpak:** 
- Web formulier op GitHub Pages
- Issue-based triggering (geen tokens nodig!)
- GitHub Actions draait Python scheduler automatisch
- Resultaat als artifact bij issue

### Fase 3: Web Interface Opzet

#### 3.1 Bestanden Aanmaken
- `docs/index.html` - Web formulier
- `docs/scheduler.js` - Issue generator (genereert GitHub issue URL)
- `docs/README.md` - Instructies voor gebruik
- `.github/workflows/schedule-on-issue.yml` - Auto-trigger workflow
- `run_scheduler_with_params.py` - Python wrapper voor CLI parameters

### Fase 4: Workflow Permissions Fix

#### 4.1 Permission Error
**Probleem:** "Error: Resource not accessible by integration"
**Oplossing:** Permissions toegevoegd aan workflow:
```yaml
permissions:
  contents: read
  issues: write
  actions: read
```

### Fase 5: Workflow Trigger Method

#### 5.1 Skip Probleem
**Probleem:** Workflow werd geskipped
**Eerste poging:** Label check (werkte niet via URL)
**Oplossing:** Body text check:
```yaml
if: contains(github.event.issue.body, 'Toernooi Configuratie')
```

### Fase 6: GitHub Actions Link op Website

#### 6.1 Status Link
**Vraag:** Link naar GitHub Actions tab opnemen?
**Oplossing:** Info box met link toegevoegd aan docs/index.html

### Fase 7: Parameters Uitbreiden - Fase 1

#### 7.1 Basis Parameters Toevoegen
**Vraag:** Deze komen nog niet terug op formulier: MATCH_DURATION, JURY_DURATION, MINIMUM_BUFFER_TIME, BREAK_ENABLED
**Toegevoegd:**
- Match duration (7 min)
- Jury duration (42 min)
- Buffer time (30 min)
- Break enabled (Ja/Nee dropdown)

**Aangepast in:**
- docs/index.html (form fields)
- docs/scheduler.js (formData + issue body)
- .github/workflows/schedule-on-issue.yml (parameter extraction)
- .github/workflows/schedule.yml (manual trigger inputs)
- run_scheduler_with_params.py (CLI arguments + config override)

### Fase 8: Start Tijd Parameter

#### 8.1 Start Tijd Toevoegen
**Vraag:** Ook nog even de start tijd
**Oplossing:** START_TIME parameter toegevoegd (type: time, default: 09:30)
**Aangepast in alle bestanden:** HTML, JS, workflows, Python wrapper

### Fase 9: Issue Body Template Fix

#### 9.1 Template Probleem Oplossen
**Probleem:** Issue template bevatte alleen parameters t/m tijdsloten
**Oorzaak:** URL lengte limiet + verkeerde break_enabled check
**Oplossing:** 
- Compactere issue body (geen bullets, kortere tekst)
- Break enabled fix: `value === 'true' ? 'Ja' : 'Nee'`
- Debug logging toegevoegd: `console.log('Form data:', formData)`

### Fase 10: Team Maximum Verwijderen

#### 10.1 Limiet Aanpassen
**Vraag:** Zit er ergens een max aan het aantal teams?
**Antwoord:** Ja, max="40" in HTML formulier
**Vraag:** Geen maximum
**Oplossing:** 
- `max="40"` verwijderd
- `min="10"` gewijzigd naar `min="2"`
- Helper text aangepast: "Minimaal 2 teams"

### Fase 11: Andere Maxima Aanpassen

#### 11.1 Limieten Verhogen
**Gevonden maxima:**
- Tafels: max="10"
- Jury Rooms: max="10"
- Wedstrijden per team: max="6"
- Tijdsloten: max="100"
- Wedstrijd duur: max="15"
- Jury duur: max="60"
- Buffer tijd: max="60"

**Vraag:** Tafels max 20, jury ook, de rest klopt wel
**Oplossing:**
- Tafels: min="2" max="20"
- Jury Rooms: min="2" max="20"
- Rest blijft ongewijzigd

### Fase 12: Pauze Parameters - Fase 2

#### 12.1 Pauze Timing Configureerbaar Maken
**Vraag:** Ook de pauze tijd moet nog als parameter mee
**Toegevoegd:**
- Break start time (168 min = 2u48)
- Break duration (35 min)

**Aangepast in:**
- docs/index.html (2 nieuwe form fields)
- docs/scheduler.js (formData + issue body)
- .github/workflows/schedule-on-issue.yml (parameter extraction + parsing)
- .github/workflows/schedule.yml (manual trigger inputs)
- run_scheduler_with_params.py (2 nieuwe CLI arguments + config override)

## Eindresultaat

### Web Interface met 12 Configureerbare Parameters:
1. **num_teams** - Aantal teams (min: 2, geen max)
2. **num_tables** - Aantal tafels (2-20)
3. **num_jury_rooms** - Aantal jury rooms (2-20)
4. **matches_per_team** - Wedstrijden per team (3-6)
5. **num_timeslots** - Aantal tijdsloten (20-100)
6. **start_time** - Start tijd toernooi (HH:MM format)
7. **match_duration** - Wedstrijd duur in minuten (5-15)
8. **jury_duration** - Jury sessie duur in minuten (30-60)
9. **buffer_time** - Buffer tijd tussen activiteiten (10-60)
10. **break_enabled** - Pauze aan/uit (Ja/Nee)
11. **break_start_time** - Pauze start tijd in minuten (0-500)
12. **break_duration** - Pauze duur in minuten (0-120)

### Complete Parameter Flow:
```
HTML Formulier (docs/index.html)
    ↓
JavaScript (docs/scheduler.js)
    ↓
GitHub Issue URL (pre-filled)
    ↓
GitHub Actions Workflow (.github/workflows/schedule-on-issue.yml)
    ↓
Python Wrapper (run_scheduler_with_params.py)
    ↓
Config Override (config.py)
    ↓
Scheduler (complete_scheduler.py)
    ↓
JSON Output + Test Results
    ↓
Artifact + Issue Comment
```

### Key Features:
- ✅ 100% Gratis hosting (GitHub Pages + Actions)
- ✅ Geen tokens/authenticatie nodig
- ✅ Alle parameters configureerbaar via web interface
- ✅ Automatische workflow trigger bij issue creation
- ✅ Resultaten als artifact + comment in issue
- ✅ Pauze correct geïmplementeerd (35 min = 5 timeslots)
- ✅ Flexibele limieten (teams onbeperkt, tafels/jury tot 20)

### Nog Te Doen:
- [ ] Changes committen en pushen naar GitHub
- [ ] GitHub Pages activeren in repository settings
- [ ] End-to-end test met live deployment
- [ ] Eventueel: Styling verbeteren van web interface
