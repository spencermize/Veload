interface PointInterface{
  lat : number;
	lng : number;
	time : string;
	hr : number;
	cadence : number;
	speed : string;
	heading? : string;  
	est? : string;
	goal? : string;
}

export class Point {
  data: PointInterface;
  
  constructor(data: PointInterface){
    this.data = data;
  }

}