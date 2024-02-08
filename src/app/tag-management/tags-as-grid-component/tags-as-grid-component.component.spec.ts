import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TagsAsGridComponentComponent} from './tags-as-grid-component.component';

describe('TagsAsGridComponentComponent', () => {
    let component: TagsAsGridComponentComponent;
    let fixture: ComponentFixture<TagsAsGridComponentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TagsAsGridComponentComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TagsAsGridComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
