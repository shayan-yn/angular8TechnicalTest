import { Component, OnInit,Input, ViewChild, ElementRef, Output } from '@angular/core';
import { Todo } from 'src/app/classes/todo.class';
import { EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  @Input() data:Todo = new Todo();
  @Output() deleted :EventEmitter<string> = new EventEmitter<string>();
  @Output() updated :EventEmitter<string> = new EventEmitter<string>();

  editing:boolean = false;
  showExtraDetail:boolean = false;
  
  constructor(
    private apiService:ApiService
  ) { }

  ngOnInit(): void {
  }
  updateTodo(){
    this.apiService.updateTodoItem(this.data).subscribe(() => this.updated.emit('deleted'));
  }

  deleteTodo(){
    this.apiService.deleteTodoItem(this.data.id).subscribe( () => this.deleted.emit('deleted'));
  }
  toggleEditMode(){
    this.editing = true;
  }

  

}
