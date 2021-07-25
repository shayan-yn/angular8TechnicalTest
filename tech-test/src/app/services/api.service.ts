import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http';
import { Observable } from "rxjs";
import {map, retry} from 'rxjs/operators';
import { Todo } from "../classes/todo.class";

@Injectable({
    providedIn:'root'
})

export class ApiService {

    todoList:Todo[] = [];

    constructor(
        private _httpClient: HttpClient
    ){}

    getAllTodos(){
        return this.todoList;
    }
    fetchAllTodos():Observable<any>{              
        return this._httpClient.get('http://localhost:3000/tasks').pipe(
            map(res => { 
                //Keep the reference instead of creating new array
                this.todoList.length = 0;
                this.transformTodoList(res).map( item => this.todoList.push(item));                
            })
        );
    }

    addNewTodoItem(item:Todo){
        //let json = JSON.stringify(item);
        return this._httpClient.post('http://localhost:3000/tasks',item);       
    }

    updateTodoItem(item:Todo){
        return this._httpClient.patch('http://localhost:3000/tasks/' + item.id,item)
    }

    deleteTodoItem(id:number){
        return this._httpClient.delete('http://localhost:3000/tasks/' + id);
    }

    getMaxTodoID():number{         
        let maxID:number = 0;
        this.todoList.map( item => {
            if(item.id > maxID)
                maxID = item.id
        })      
      return maxID;
    }

    transformTodoList(data:any):Todo[]{
        return [...data].map( item => this.transformTodoItem(item));
    }
    transformTodoItem(data:any):Todo{
        let newTodoItem:Todo = new Todo();

        try {
            newTodoItem.id = data['id'];
            newTodoItem.category = data['category'];
            newTodoItem.description = data['description'];
            newTodoItem.done = data['done'];
            newTodoItem.label = data['label'];
            
        } catch (error) {            
        }

        return newTodoItem;
    }

  

}