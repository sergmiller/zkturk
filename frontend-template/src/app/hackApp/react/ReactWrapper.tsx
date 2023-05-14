import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import { CustomReactComponent } from './react.component';
import { IDKitWidget } from '@worldcoin/idkit';

import { createRoot } from 'react-dom/client';



const containerElementName = 'customReactComponentContainer';

@Component({
  selector: 'app-my-component',
  template: `<span #${containerElementName}></span>`,
  // styleUrls: [''],
  encapsulation: ViewEncapsulation.None,
})
export class CustomReactComponentWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: true }) containerRef!: ElementRef;

  @Input() public counter = 10;
  @Output() public componentClick = new EventEmitter<void>();

  constructor() {
      this.handleDivClicked = this.handleDivClicked.bind(this);
  }

  public handleDivClicked() {
      if (this.componentClick) {
          this.componentClick.emit();
          this.render();
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.render();
  }

  ngAfterViewInit() {
      this.render();
  }

  ngOnDestroy() {
      // ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
      // root.unmount();
  }




  private render() {

    // const root = createRoot(this.containerRef.nativeElement); // createRoot(container!) if you use TypeScript
    // root.render(<IDKitWidget
    //   app_id="app_BPZsRJANxct2cZxVRyh80SFG" // obtain this from developer.worldcoin.org
    //   action="my_action"
    //   enableTelemetry
    //   onSuccess={result => console.log(result)} // pass the proof to the API or your smart contract
    // />);




    const root = createRoot(this.containerRef.nativeElement);
    root.render(<AppWithCallbackAfterRender />);




      // ReactDOM.render(
      //     <React.StrictMode>
      //         <div>
      //             <CustomReactComponent/>
      //         </div>
      //     </React.StrictMode>
      //     , this.containerRef.nativeElement);
  }
}

function AppWithCallbackAfterRender() {
  React.useEffect(() => {
    console.log('rendered');
  });

  return <div>HELLO<IDKitWidget
  app_id="app_BPZsRJANxct2cZxVRyh80SFG" // obtain this from developer.worldcoin.org
  action="my_action"
  enableTelemetry
  onSuccess={result => console.log(result)} // pass the proof to the API or your smart contract
/></div>
}
