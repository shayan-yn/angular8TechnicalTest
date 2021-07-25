import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {Todo} from '../../classes/todo.class';
import { FormControl,FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'todo-list',
  templateUrl: './todoList.component.html',
  styleUrls: ['./todoList.component.scss']
})
export class TodoListComponent implements OnInit {

  editingList:boolean = false;
  isFiltered:boolean = false;

  @ViewChild('cb',{static: false}) cb? : ElementRef;
  @ViewChild('df',{static: false}) df? : ElementRef;

  todoForm = new FormGroup({
    descriptionControl: new FormControl('',Validators.required),
    categoryControl: new FormControl(''),
    labelControl: new FormControl('')
  })

  todoList:Todo[] = this.apiService.todoList;
  filteredTodoList:Todo[] = [];

  constructor(
    private apiService:ApiService
  ) { }

  ngOnInit(): void {  
    this.refreshData()
  }  
  addTodo(){
    if(this.todoForm.valid){
      let newTodo:Todo = new Todo();

      newTodo.id = this.apiService.getMaxTodoID() + 1;
      newTodo.label = this.todoForm.get('labelControl').value;    
      newTodo.description = this.todoForm.get('descriptionControl').value;
      newTodo.category = this.todoForm.get('categoryControl').value;
      newTodo.done = false;  
  
      this.apiService.addNewTodoItem(newTodo).subscribe(
        () => {
          this.todoForm.get('labelControl').setValue('');
          this.todoForm.get('descriptionControl').setValue('');
          this.todoForm.get('categoryControl').setValue('');
          this.editingList = false;
          this.refreshData();
        }
      );
    }   
  }
  
  applyFilters(){

    //Reset data from service
    this.todoList = [...this.apiService.todoList];    

    let searchString = this.df.nativeElement.value;  
    this.todoList =  this.filterByString(this.todoList,searchString);
         
    if(this.cb.nativeElement.checked)       
      this.todoList = this.filterDoneTodos(this.todoList);
  }

  filterDoneTodos(todo:Todo[]){
    return todo.filter(t => t.done == true);
  }

  filterByString(todo:Todo[],searchString:string){
    let lowerCaseSearchString:string = searchString.toLocaleLowerCase();
    return todo.filter(t => t.description.toLocaleLowerCase().includes(lowerCaseSearchString) || t.category.toLocaleLowerCase().includes(lowerCaseSearchString) || t.label.toLocaleLowerCase().includes(lowerCaseSearchString))
  }

  refreshData(){
    this.apiService.fetchAllTodos().subscribe( ()=> {      
      this.applyFilters()
    } )
  }
}
