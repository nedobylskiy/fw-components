import AppPage from "../modules/ui/AppPage.mjs";

let app = new AppPage($('#app'));
await app.init();

console.log(app);
