import React, { Component } from 'react'; 
import '../MyWorkout.css'
import { FORMERR } from 'dns';
import MaterialTable from 'material-table'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
var placeholder = document.createElement("tr");
placeholder.className = "placeholder";

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

export default class MyWorkout extends Component {
  
  state = {
    workouts: [],
    selectedWorkout: 3,
    selectedWorkoutExercises: []
  }

  

  componentDidMount(){
  fetch(`http://localhost:3001/users/3`)
  .then(res => res.json())
  .then(data => this.addWorkouts(data)) 
  .then(this.setSelectedWorkoutExercises)
  }              
  
  addWorkouts = (userData) => {
      const workouts = userData.workouts
      this.setState({
        workouts: workouts
      })
  }

  setSelectedWorkoutExercises = () => {
    const workoutId = this.state.selectedWorkout
    const workout = this.state.workouts.filter(workout => workout.id === workoutId)
    const exercises = workout[0].workoutexercises
    // console.log(exercises)
    // const orderedExercises = exercises.sort( (a, b) => a.order - b.order )
    this.setState({
      selectedWorkoutExercises: exercises
    })
  }

  dragStart(e) {
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.dragged);
  }
  dragEnd(e) {
    this.dragged.style.display = '';
    this.dragged.parentNode.removeChild(placeholder);
    
    // update state
    var data = this.state.selectedWorkoutExercises;
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id);
    if(from < to) to--;
    data.splice(to, 0, data.splice(from, 1)[0]);
    this.setState({selectedWorkoutExercises: data})
    console.log(this.state.selectedWorkoutExercises)
    fetch('http://localhost:3001/workouts/3', {
      method: 'PATCH',
      body: JSON.stringify({workoutexercises: this.state.selectedWorkoutExercises}), 
      headers:{'Content-Type': 'application/json'}
      }).then(res => res.json())
    }

  dragOver(e) {
    e.preventDefault();
    this.dragged.style.display = "block";
    if(e.target.className === 'placeholder') return;
    this.over = e.target;
    e.target.parentNode.insertBefore(placeholder, e.target);
  }

  
	render() {
    var listItems = this.state.selectedWorkoutExercises.map((item, i) => {
      return ( 
        <form className='workoutrow'
          data-id={i}
          key={i}
          draggable='true'
          onDragEnd={this.dragEnd.bind(this)}
          onDragStart={this.dragStart.bind(this)}>
        <label>
          {item} <br></br>
          <input type="text" name="name" placeholder="Enter Reps"/>
          <input type="text" name="name" placeholder="Enter Sets"/>
          <input type="text" name="name" placeholder="Enter Rest Period"/>
        </label>
        
        
      </form>
      )
     });
		return (
			<div onDragOver={this.dragOver.bind(this)}>
        {listItems}
        <input type="submit" value="Submit" />
      </div>
      
      
		)
	}
}

// ADDING MATERIAL UI
