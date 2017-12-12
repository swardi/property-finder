export interface Duration{
	h:string;
	m:string;
}

export interface Deal {
	arrival : string;
	cost:number;
	departure:string;
	discount:string;
	duration:Duration;
	reference:string;
	transport:string;

}

export class PriorityQueue {
  private _nodes = [];

  enqueue (priority :any, key: any) {
    this._nodes.push({key: key, priority: priority });
    this.sort();
  };
  
  dequeue  () {
    return this._nodes.shift().key;
  };
  
  sort  () {
    this._nodes.sort(function (a, b) {
      return a.priority - b.priority;
    });
  };
  
  isEmpty () {
    return !this._nodes.length;
  };
}
