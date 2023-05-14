import { Component, ElementRef, ViewChild } from "@angular/core";
import { remove } from "lodash";

  interface Problem {
    title: string;
    priceForOne: number;
    overlap: string
    description: string;
    images: string[];
    variants: string[];
  }




@Component({
  selector: "app-new-task-layout",
  templateUrl: "./new-task-layout.component.html",
  styleUrls: ["./new-task-layout.component.scss"],
})
export class NewTaskLayoutComponent {
  @ViewChild("imageInput", { static: true }) imageInput: ElementRef<HTMLInputElement> | undefined;

  @ViewChild("variantInput", { static: true }) variantInput: ElementRef<HTMLInputElement> | undefined;

  public title: string = "";

  public priceForOne: string = "";

  public overlap: string = "";

  public description: string = "";








  uploadedFiles: any[] = [];

  public images: string[] = [];

  public variants: string[] = [];

  pushImage() {
    if (this.imageInput) {
      const url = this.imageInput?.nativeElement.value;
      this.images.push(url);
      this.imageInput.nativeElement.value = "";
      console.log("pushImage", this.images);
    }
  }

  removeImage(url: string) {
    remove(this.images, (i) => i === url);
  }

  pushVariant() {
    if (this.variantInput) {
      const variant = this.variantInput?.nativeElement.value;
      this.variants.push(variant);
      this.variantInput.nativeElement.value = "";
      console.log("pushVariant", this.variants);
    }
  }

  removeVariant(variant: string) {
    remove(this.variants, (v) => v === variant);
  }

  // onSelect(event: any) {
  //   for (const file of event.files) {
  //     if (!this.uploadedFiles.some((f) => f.name === file.name)) {
  //       this.uploadedFiles.push(file);
  //     }
  //   }
  // }

  // onClear() {
  //   console.log("onClear", this.uploadedFiles);
  //   this.uploadedFiles = [];
  // }

  // onRemove(event: any) {
  //   remove(this.uploadedFiles, (f) => f.name === event.file.name);
  // }



  public sendProblem() {


    // const problem: Problem = {
    //   title: "title",
    // }





  }
}
