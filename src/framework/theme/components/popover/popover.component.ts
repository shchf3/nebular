/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ChangeDetectorRef, Component, HostBinding, Input, TemplateRef, Type, ViewChild } from '@angular/core';
import { NbPopoverPlacement } from './helpers/model';
import { NgComponentOutlet } from '@angular/common';

/**
 * Popover can be one of the following types:
 * template, component or plain js string.
 * So NbPopoverContent provides types alias for this purposes.
 * */
export type NbPopoverContent = string | TemplateRef<any> | Type<any>;

/**
 * Popover container.
 * Renders provided content inside.
 *
 * @inline-example(popover/popover-example.component)
 * first description
 * @inline-example(popover/popover-example.component.ts, 15, 20)
 * second description
 * @live-example(popover/popover-example.component)
 * third description
 * @example(popover/popover-example.component)
 * fifth description
 * @more-live-examples
 * popover1
 * popover2
 * popover3
 * popover4
 *
 * @styles
 *
 * popover-fg
 * popover-bg
 * popover-border
 * popover-shadow
 * */
@Component({
  selector: 'nb-popover',
  styleUrls: ['./popover.component.scss'],
  template: `
    <span class="arrow"></span>

    <ng-container *ngIf="isTemplate">
      <ng-container *ngTemplateOutlet="content; context: context"></ng-container>
    </ng-container>
    <ng-container *ngIf="isComponent" [ngComponentOutlet]="content"></ng-container>
    <ng-container *ngIf="isPrimitive">
      <div class="primitive-popover">{{content}}</div>
    </ng-container>
  `,
})
export class NbPopoverComponent {

  /**
   * Content which will be rendered.
   * */
  @Input()
  content: NbPopoverContent;

  /**
   * Context which will be passed to rendered component instance.
   * */
  @Input()
  context: Object;

  /**
   * Popover placement relatively host element.
   * */
  @Input()
  @HostBinding('class')
  placement: NbPopoverPlacement = NbPopoverPlacement.TOP;

  @Input()
  @HostBinding('style.top.px')
  positionTop: number;

  @Input()
  @HostBinding('style.left.px')
  positionLeft: number;

  /**
   * If content type is TemplateRef we're passing context as template outlet param.
   * But if we have custom component content we're just assigning passed context to the component instance.
   * */
  @ViewChild(NgComponentOutlet)
  set componentOutlet(el) {
    if (this.isComponent) {
      Object.assign(el._componentRef.instance, this.context);
      /**
       * Change detection have to performed here, because another way applied context
       * will be rendered on the next change detection loop and
       * we'll have incorrect positioning. Because rendered component may change its size
       * based on the context.
       * */
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Check that content is a TemplateRef.
   *
   * @return boolean
   * */
  get isTemplate(): boolean {
    return this.content instanceof TemplateRef;
  }

  /**
   * Check that content is an angular component.
   *
   * @return boolean
   * */
  get isComponent(): boolean {
    return this.content instanceof Type;
  }

  /**
   * Check that if content is not a TemplateRef or an angular component it means a primitive.
   * */
  get isPrimitive(): boolean {
    return !this.isTemplate && !this.isComponent;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }
}
