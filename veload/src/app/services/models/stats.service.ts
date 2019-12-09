export interface Stat {
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
    circ: number
}

//  = 2.120
