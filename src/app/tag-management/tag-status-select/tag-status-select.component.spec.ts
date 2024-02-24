import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TagStatusSelectComponent} from './tag-status-select.component';

describe('TagStatusSelectComponent', () => {
    let component: TagStatusSelectComponent;
    let fixture: ComponentFixture<TagStatusSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TagStatusSelectComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TagStatusSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
