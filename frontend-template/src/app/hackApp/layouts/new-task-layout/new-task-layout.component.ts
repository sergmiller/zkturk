import { Component } from "@angular/core";
import { remove } from "lodash";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-new-task-layout",
  templateUrl: "./new-task-layout.component.html",
  styleUrls: ["./new-task-layout.component.scss"],
})
export class NewTaskLayoutComponent {
  uploadedFiles: any[] = [];

  onSelect(event: any) {
    for (const file of event.files) {
      if (!this.uploadedFiles.some((f) => f.name === file.name)) {
        this.uploadedFiles.push(file);
      }
    }
  }

  onClear() {
    console.log("onClear", this.uploadedFiles);
    this.uploadedFiles = [];
  }

  onRemove(event: any) {
    remove(this.uploadedFiles, (f) => f.name === event.file.name);
  }
}
