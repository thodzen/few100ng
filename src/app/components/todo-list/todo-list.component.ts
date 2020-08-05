import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoListItem } from '../../models';
import { TodoDataService } from '../../services/todo-data.service';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {

  items$: Observable<TodoListItem[]>;
  hasCompleted$: Observable<boolean>;
  subscription: Subscription;

  constructor(private service: TodoDataService) { }

  ngOnInit(): void {
    this.items$ = this.service.getObservable();
    this.hasCompleted$ = this.service.hasCompleted();
    this.service.getAll();

    // if you manually subscribe, you should also unsubscribe (done on ngOnDestory())
    this.subscription = this.service.getObservable()
      .pipe(
        tap(items => console.log(items))
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  markCompleted(item: TodoListItem): void {
    this.service.markComplete(item);
  }

  clearCompleted(): void {
    this.service.clearCompleted();
  }

  addItem(item: HTMLInputElement): void {
    const description = item.value;

    item.value = ''; // clear that sucker out
    item.focus(); // put the cursor (focus) back in the text box so they can add another item
    this.service.addOne(description);
  }
}
