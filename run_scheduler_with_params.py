"""
Wrapper script to run scheduler with command line parameters
Dynamically overwrites config values before running
"""
import sys
import argparse

def main():
    parser = argparse.ArgumentParser(description='FLL Tournament Scheduler with custom parameters')
    parser.add_argument('--num-teams', type=int, help='Aantal teams (10-40)')
    parser.add_argument('--num-tables', type=int, help='Aantal tafels (4-10)')
    parser.add_argument('--num-jury-rooms', type=int, help='Aantal jury rooms (4-10)')
    parser.add_argument('--matches-per-team', type=int, help='Wedstrijden per team')
    parser.add_argument('--num-timeslots', type=int, help='Aantal tijdsloten')
    parser.add_argument('--match-duration', type=int, help='Wedstrijd duur in minuten')
    parser.add_argument('--jury-duration', type=int, help='Jury sessie duur in minuten')
    parser.add_argument('--buffer-time', type=int, help='Buffer tijd tussen activiteiten')
    parser.add_argument('--break-enabled', type=str, help='Pauze inschakelen (Ja/Nee)')
    
    args = parser.parse_args()
    
    # Import config and override values
    import config
    
    if args.num_teams is not None:
        config.NUM_TEAMS = args.num_teams
    if args.num_tables is not None:
        config.NUM_TABLES = args.num_tables
    if args.num_jury_rooms is not None:
        config.NUM_JURY_ROOMS = args.num_jury_rooms
    if args.matches_per_team is not None:
        config.MATCHES_PER_TEAM = args.matches_per_team
    if args.num_timeslots is not None:
        config.NUM_TIMESLOTS = args.num_timeslots
    if args.match_duration is not None:
        config.MATCH_DURATION = args.match_duration
    if args.jury_duration is not None:
        config.JURY_DURATION = args.jury_duration
    if args.buffer_time is not None:
        config.MINIMUM_BUFFER_TIME = args.buffer_time
    if args.break_enabled is not None:
        config.BREAK_ENABLED = args.break_enabled.lower() in ['ja', 'yes', 'true', '1']
    
    # Now run the scheduler
    from complete_scheduler import create_complete_schedule, build_json_output, print_summary, save_json
    
    result = create_complete_schedule()
    
    if result:
        output = build_json_output(result)
        print_summary(output, result)
        filename = save_json(output)
        print(f"\n✅ Compleet schema succesvol gegenereerd!")
    else:
        print("\n❌ Geen oplossing gevonden - pas parameters aan")
        sys.exit(1)

if __name__ == "__main__":
    main()
