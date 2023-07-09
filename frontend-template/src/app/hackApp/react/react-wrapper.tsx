import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { CredentialType, IDKitWidget, ISuccessResult } from '@worldcoin/idkit';

const containerElementName = 'customReactComponentContainer';

@Component({
  selector: 'react-wrapper',
  template: `<span #${containerElementName}></span>`,
  encapsulation: ViewEncapsulation.None,
})
export class ReactWrapper implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: true }) containerRef!: ElementRef;

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
    const root = createRoot(this.containerRef.nativeElement);
    root.render(<RApp />);
  }
}

function RApp() {
  React.useEffect(() => {
    console.log('rendered');
  });

  const handleProof = (result: any) => {
    return new Promise((resolve: (value?: any) => void) => {
      setTimeout(() => resolve(), 3000);
      // NOTE: Example of how to decline the verification request and show an error message to the user
    });
  };

  const onSuccess = (result: any) => {
    console.log('IS_RESULT', result);
  };

  const action = 'my_action';
  const app_id = 'app_27e786e19bc6472e4d4cd8256eaa2fc4';

  return (
    <div className="App">
      <IDKitWidget action={action} signal="my_signal" onSuccess={onSuccess} handleVerify={handleProof} app_id={app_id}>
        {({ open }: any) => (
          <button className="p-ripple p-element p-button-raised p-button-secondary connect-button p-button p-component" onClick={open}>
            World ID
          </button>
        )}
      </IDKitWidget>
    </div>
  );
}
