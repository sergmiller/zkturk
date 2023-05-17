import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { NotfoundComponent } from "./demo/components/notfound/notfound.component";
import { AppLayoutComponent } from "./layout/app.layout.component";
import { MainLayoutComponent } from "./hackApp/layouts/main-layout/main-layout.component";
import { NewTaskLayoutComponent } from "./hackApp/layouts/new-task-layout/new-task-layout.component";
import { AllMyTasksLayoutComponent } from "./hackApp/layouts/all-my-tasks-layout/all-my-tasks-layout.component";
import { AvailableTasksLayoutComponent } from "./hackApp/layouts/available-tasks-layout/available-tasks-layout.component";
import { MyLandingComponent } from "./hackApp/layouts/my-landing/my-landing.component";

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: "",
          component: MainLayoutComponent,
          children: [
            { path: "", component: MyLandingComponent },
            { path: "available-tasks", component: AvailableTasksLayoutComponent },
            { path: "new-task", component: NewTaskLayoutComponent },
            { path: "all-my-tasks", component: AllMyTasksLayoutComponent },

            // {
            //   path: "uikit",
            //   loadChildren: () => import("./demo/components/uikit/uikit.module").then((m) => m.UIkitModule),
            // },

            // {
            //   path: "dashboard",
            //   loadChildren: () => import("./demo/components/dashboard/dashboard.module").then((m) => m.DashboardModule),
            // },
            // {
            //   path: "uikit",
            //   loadChildren: () => import("./demo/components/uikit/uikit.module").then((m) => m.UIkitModule),
            // },
            // {
            //   path: "utilities",
            //   loadChildren: () => import("./demo/components/utilities/utilities.module").then((m) => m.UtilitiesModule),
            // },
            // {
            //   path: "documentation",
            //   loadChildren: () => import("./demo/components/documentation/documentation.module").then((m) => m.DocumentationModule),
            // },
            // {
            //   path: "blocks",
            //   loadChildren: () => import("./demo/components/primeblocks/primeblocks.module").then((m) => m.PrimeBlocksModule),
            // },
            // {
            //   path: "pages",
            //   loadChildren: () => import("./demo/components/pages/pages.module").then((m) => m.PagesModule),
            // },
          ],
        },
        // {
        //   path: "demo",
        //   component: AppLayoutComponent,
        //   children: [
        //     // {
        //     //   path: "",
        //     //   loadChildren: () => import("./demo/components/dashboard/dashboard.module").then((m) => m.DashboardModule),
        //     // },
        //     // {
        //     //   path: "uikit",
        //     //   loadChildren: () => import("./demo/components/uikit/uikit.module").then((m) => m.UIkitModule),
        //     // },
        //     // {
        //     //   path: "utilities",
        //     //   loadChildren: () => import("./demo/components/utilities/utilities.module").then((m) => m.UtilitiesModule),
        //     // },
        //     // {
        //     //   path: "documentation",
        //     //   loadChildren: () => import("./demo/components/documentation/documentation.module").then((m) => m.DocumentationModule),
        //     // },
        //     // {
        //     //   path: "blocks",
        //     //   loadChildren: () => import("./demo/components/primeblocks/primeblocks.module").then((m) => m.PrimeBlocksModule),
        //     // },
        //     // {
        //     //   path: "pages",
        //     //   loadChildren: () => import("./demo/components/pages/pages.module").then((m) => m.PagesModule),
        //     // },
        //   ],
        // },
        // {
        //   path: "auth",
        //   loadChildren: () => import("./demo/components/auth/auth.module").then((m) => m.AuthModule),
        // },
        // {
        //   path: "landing",
        //   loadChildren: () => import("./demo/components/landing/landing.module").then((m) => m.LandingModule),
        // },
        { path: "notfound", component: NotfoundComponent },
        { path: "**", redirectTo: "/notfound" },
      ],
      {
        scrollPositionRestoration: "enabled",
        anchorScrolling: "enabled",
        onSameUrlNavigation: "reload",
      },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
