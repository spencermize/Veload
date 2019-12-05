export interface StatsService {
    speed: number,
    cadence: number,
    hr: number,
    status: string,
    sensors: {
      hr: boolean,
      speed: boolean,
      cadence: boolean
    },
    stick: any,
    circ: 2.120
}
