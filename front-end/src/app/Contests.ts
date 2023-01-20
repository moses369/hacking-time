export interface ContestsI {
    site:string;
    name:string;
    start_time:  Date;
    end_time:  Date;
    duration:string | number;
    url:string;
    in_24_hours:string;
    status:string;
    saved:boolean;
}