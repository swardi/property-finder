import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import {SearchService} from "./search.service";

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


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    propertyFinderForm : FormGroup;
    searchForm = { from: '', to: '' };
    loginPromise: Promise<any>;
    departures : any[] = [];
    arrivals : any[]=[];
    departureNames : any[]=[];
    arrivalNames : any[] = [];
    selectedPath : any[] = [];
    currencySymbol : string = "$";
    criteria : string = "Cheapest"
    constructor(private searchService: SearchService, private fb: FormBuilder) {
        
    }

    ngOnInit() {
		    	
    	this.resetForm();	
        this.loadData();
	}

	setSelection(selection){
		this.criteria = selection;
	}
	resetForm (){
		this.selectedPath = [];
		this.searchForm = { from: '', to: '' };
		this.propertyFinderForm = new FormGroup({
            'to': new FormControl(this.searchForm.to,
                [Validators.required]),
            'from': new FormControl(this.searchForm.from, [
                Validators.required
            ])
        });

	}
	loadData () {
		this.searchService.search().then(response => {
			this.currencySymbol = response.json().currency;
        	this.transformData(response.json().deals)
      
        }, error => {});
	}

	transformData(deals: any[]) {
		deals.forEach(deal => {
            if(!this.departures[deal.departure]){
				this.departures[deal.departure] = [];
			}
			this.departures[deal.departure].push(deal);

			if(!this.arrivals[deal.arrival]){
				this.arrivals[deal.arrival] = [];
			}
			this.arrivals[deal.arrival].push(deal);
        })
        console.log(this.departures);
		this.departureNames = Object.keys(this.departures);        
		this.arrivalNames = Object.keys(this.arrivals);
	}

	search (){
		if(this.searchForm.from === this.searchForm.to){
			alert("Please select a location different from departure");
			return;
		}
		let nodes = new PriorityQueue();
		let INFINITY = 1/0;
        let distances = {};
        let previous = {};
        var smallest, vertex, neighbor, alt;

      //Initialize distance array, will contain infinity for all values and 0 for start
    this.departureNames.forEach(vertex => {
      if(vertex === this.searchForm.from) {
        distances[vertex] = 0;
        nodes.enqueue(0, vertex);
      }
      else {
        distances[vertex] = INFINITY;
        nodes.enqueue(INFINITY, vertex);
      }

      previous[vertex] = null;
    });


    // For each element in queue create path of predecessors
    while(!nodes.isEmpty()) {
      smallest = nodes.dequeue();

      if(smallest === this.searchForm.to) {
        this.selectedPath = [];

        while(previous[smallest]) {
          this.selectedPath.push(previous[smallest]);
          smallest = previous[smallest].departure;
        }
        this.selectedPath = this.selectedPath.reverse();
        break;
      }

      if(!smallest || distances[smallest] === INFINITY){
        continue;
      }

      this.departures[smallest].forEach( neighbor => {
      	if(this.criteria === "cheapest"){
      		alt = distances[smallest] + ( neighbor.cost - Math.ceil(neighbor.cost*neighbor.discount/100) );	
          neighbor.discountedCost =  neighbor.cost - Math.ceil(neighbor.cost*neighbor.discount/100);
      	}else{
    			alt = distances[smallest] + ( parseInt(neighbor.duration.h)*60 + parseInt(neighbor.duration.h) );	      		
          neighbor.discountedCost =  neighbor.cost - Math.ceil(neighbor.cost*neighbor.discount/100);
      	}
        
        if(alt < distances[neighbor.arrival]) {
          distances[neighbor.arrival] = alt;
          previous[neighbor.arrival] = neighbor;
          neighbor.totalCost=alt;
          nodes.enqueue(alt, neighbor.arrival);
        }
      });
    }

	}





}
