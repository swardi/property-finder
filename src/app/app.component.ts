import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {Duration, Deal, PriorityQueue} from './model';
import {SearchService} from "./search.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
    propertyFinderForm : FormGroup;
    searchForm = { from: '', to: '' }; 
    departures : any[] = []; 
    departureNames : any[]=[]; 
    selectedPath : any[] = [];
    currencySymbol : string = "$";
    criteria : string = "Cheapest"

    constructor(private searchService: SearchService, private fb: FormBuilder) {
        
    }

  // Initialize the form and load data.
  ngOnInit() {
    	this.resetForm();	
      this.loadData();
	}

  // Cheapest or fastest
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
	
  //Load JSON data.
  loadData () {
		this.searchService.search().then(response => {
			this.currencySymbol = response.json().currency;
        	this.transformData(response.json().deals)
      
        }, error => {});
	}

  // Transform data into a Graph structure
	transformData(deals: any[]) {
		deals.forEach(deal => {
            if(!this.departures[deal.departure]){
				this.departures[deal.departure] = [];
			}
			this.departures[deal.departure].push(deal);
   })

		this.departureNames = Object.keys(this.departures);        
	}


	search (){
    // If both to and from are the same prompt the user
		if(this.searchForm.from === this.searchForm.to){
			alert("Please select a location different from departure");
			return;
		}

		let nodes = new PriorityQueue();
		let INFINITY = 1/0;
    let distances = {};
    let previous = {};
    var smallest, vertex, neighbor, alt;

    
    //Initialize previous and distance array, will contain infinity for all values and 0 for start
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

      //If this is the last node, you are done, copy the path to path array.
      if(smallest === this.searchForm.to) {
        this.selectedPath = [];

        while(previous[smallest]) {
          this.selectedPath.push(previous[smallest]);
          smallest = previous[smallest].departure;
        }
        //Reverse the array to start from the starting point
        this.selectedPath = this.selectedPath.reverse();
        break;
      }

      if(!smallest || distances[smallest] === INFINITY){
        continue;
      }

      this.departures[smallest].forEach( neighbor => {
      	if(this.criteria === "cheapest"){
      		alt = distances[smallest] + ( neighbor.cost - Math.ceil(neighbor.cost*neighbor.discount/100) );  	
          neighbor.discountedCost =  neighbor.cost - Math.ceil(neighbor.cost*neighbor.discount/100); // Calculate on the base of discount to display on UI
      	}else{
    			alt = distances[smallest] + ( parseInt(neighbor.duration.h)*60 + parseInt(neighbor.duration.h) );	      		
          neighbor.discountedCost =  neighbor.cost - Math.ceil(neighbor.cost*neighbor.discount/100);
      	}
        
        if(alt < distances[neighbor.arrival]) {
          distances[neighbor.arrival] = alt;
          previous[neighbor.arrival] = neighbor;
          neighbor.totalCost=alt;  // Keep a track of total cost for each path. This will be used on the UI too to display total cost
          nodes.enqueue(alt, neighbor.arrival);
        }
      });
    }

	}





}
