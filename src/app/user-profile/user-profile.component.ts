import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { ApiSecService } from "../apisec.service";
import { ChartSecService } from "../chartsec.service";
import { ChartSubService } from "../chartsub.service";
import { Chart } from "chart.js";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit,OnDestroy {
  ngOnDestroy(){
    if(this.fcdgraph2)
    {
      console.log("Destory");
      this.fcdgraph2.destroy();
      this.canvas2.destroy();
    }
  }
  results = [];
  charts = [];
  charts1 = [];
  sem;
  sems = [];
  batch;
  batchs = [2015, 2016, 2017];
  sec;
  secs = ["A", "B", "C"];
  sub;
  subs = [];
  year = new Date().getFullYear();
  n;
  i;
  passCount = 0;
  failCount = 0;
  passSubACount = 0;
  failSubACount = 0;
  passSubBCount = 0;
  failSubBCount = 0;
  passSubCCount = 0;
  failSubCCount = 0;
  pass1Count = 0;
  fail1Count = 0;
  chart = [];
  chart1 = [];
  seriesData = [];
  fcdgraph2;
  canvas2;
  constructor(
    private apisecservice: ApiSecService,
    private chartservice: ChartSecService,
    private chartsubservice: ChartSubService,
    private data: DataService
  ) {}

  ngOnInit() {}
  setBatch(batch) {
    console.log(batch);
    if (batch === "2015") {
      this.sems = [];
      this.n = (this.year - batch) * 2;
      for (this.i = 1; this.i <= this.n; this.i++) {
        this.sems.push(this.i);
      }
    }
    if (batch === "2016") {
      this.sems = [];
      this.n = (this.year - batch) * 2;
      for (this.i = 1; this.i <= this.n; this.i++) {
        this.sems.push(this.i);
      }
    }
    if (batch === "2017") {
      this.sems = [];
      this.n = (this.year - batch) * 2;
      for (this.i = 1; this.i <= this.n; this.i++) {
        this.sems.push(this.i);
      }
    }
    this.batch = batch;
  }
  exportAsExcel()
  {
    var scode = this.sub.substr(0,this.sub.indexOf(' '));
    window.open("http://127.0.0.1:8000/genXL/?sec="+this.sec+"&scode="+scode+"&batch="+this.batch, "_blank");
  }
  setSem(sem) {
    this.sem = sem;
    if (this.batch == 2016 && this.sem == 4) {
      this.subs = [
        "15MAT41 (ENGINEERING-MATHEMATICS)",
        "15CS42 (SE)",
        "15CS43 (DAA)",
        "15CS44 (MP&MC)",
        "15CS45 (OOC)",
        "15CS46 (DC)",
        "15CSL47 (DAA-LAB)",
        "15CSL48 (MP&MC-LAB)"
      ];
    } else if (this.batch == 2015 && this.sem == 6) {
      this.subs = [
        "15CS61 (Cryptography)",
        "15CS62 (CG)",
        "15CS63 (System-Software-and-Compiler-Design)",
        "15CS64 (Operating Systems)",
        "15CS651 (Data-Mining)",
        "15CS653 (OR)",
        "15CS661 (MAD)",
        "15CS664 (Python)",
        "15CSL67 (SS&OS-LAB)",
        "15CSL68 (CG-Laboratory)"
      ];
    } else if (this.batch == 2017 && this.sem == 2) {
      this.subs = [
        "17PCD23 (CCP)",
        "17MAT21 (Mat-2)",
        "17ELN25 (ELN)",
        "17CPL26 (CCP-LAB)",
        "17CHEL27 (CHEM-LAB)",
        "17CHE22 (CHEM)",
        "17CED24 (CAED)"
      ];
    }
  }
  setSec(sec) {
    this.sec = sec;
  }
  setSub(sub) {
    this.sub = sub;
  }
  api() {
    console.log(this.batch, this.sem, this.sec, this.sub);
    var gen: string;
    var sub: string = this.sub;
    var scode = sub.substr(0,sub.indexOf(' '));
    if(this.sec==undefined)
      gen = 'http://127.0.0.1:8000/getfcd/?&sc=' + scode + '&batch=' + this.batch;
    else
      gen = 'http://127.0.0.1:8000/secfcd/?sec=' + this.sec + '&scode=' + scode + '&batch=' + this.batch;
    this.data.changeMessage(gen);
    this.apisecservice
      .getResultSec(this.batch, this.sem, this.sec)
      .subscribe(result => {
        this.results = result;
        // console.log(result);
      });
      this.data.currentMessage.subscribe(message => { this.seriesData = message.split(',').map(Number);
      console.log(this.seriesData);    
      if(this.fcdgraph2) this.fcdgraph2.destroy(); 
      this.fcdgraph2 = new Chart("fcdgraph2", {
        type: 'bar',
        data: {
          labels: ['FCD', 'FC', 'SC', 'P', 'F'],
          datasets: [{
              data: this.seriesData,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
        legend:{
          display:false
        }
      }
      });
      this.passCount = this.seriesData[0]+this.seriesData[1]+this.seriesData[2]+this.seriesData[3];
      this.failCount = this.seriesData[4];
      if(this.canvas2) this.canvas2.destroy();
      this.canvas2 = new Chart("canvas2", {
        type: "pie", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
          labels: ["Fail", "Pass"],
          datasets: [
            {
              data: [this.failCount, this.passCount],
              //backgroundColor:'green',
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)"
              ],
              borderWidth: 1,
              borderColor: "#777",
              hoverBorderWidth: 3,
              hoverBorderColor: "#000"
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: this.sub,
            fontSize: 25
          },
          legend: {
            display: true,
            position: "right",
            labels: {
              fontColor: "#000"
            }
          },
          layout: {
            padding: {
              left: 50,
              right: 0,
              bottom: 0,
              top: 0
            }
          },
          tooltips: {
            enabled: true
          }
        }
      });
     });
  }
}
