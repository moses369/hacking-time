import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ContestsI } from '../Contests';
//Made from the bootstrap example

export type SortColumn = keyof ContestsI | '';
export type SortDirection = 'asc' | 'desc' | '';

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: 'asc', '': 'asc' };

@Directive({
	selector: 'th[sortable]',
	//Host lets us mutate our tag with properties/atrributes
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'(click)': 'rotate()',
	},
})
export class SortableHeadDirective {
	@Input() sortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
	}
}