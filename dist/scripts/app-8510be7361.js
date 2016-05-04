!function(){"use strict";angular.module("GradeTrack",["ngRoute","ngAnimate","chart.js","ui.bootstrap","toastr"])}(),function(){"use strict";function e(e,t,s){var n=this;n.list=function(){return e.list()},n.activeCourse=function(){return t.getActiveCourse()},n.removeStudent=function(t){var s=e.students.indexOf(t);s>-1&&e.students.splice(s,1)},n.openAddStudentModal=function(e){s.open({animation:!0,templateUrl:"app/AddStudent/AddStudentModal.html",controller:"AddStudentModalController",controllerAs:"AddStudentModalController",size:e})}}e.$inject=["StudentService","GradeService","$uibModal"],angular.module("GradeTrack").controller("StudentsController",e)}(),function(){"use strict";function e(e,t,s,n){var a=this;a.type="student",a.email="",a.username="",a.password="",a.firstName="",a.lastName="",a.studentID="",a.errorText={first:"",last:"",email:"",username:"",password:"",id:""},a.isInputError=function(){a.errorText.first=a.errorText.last=a.errorText.email=a.errorText.username=a.errorText.password=a.errorText.id="";var e=!1;return""==a.username&&(a.errorText.username="Enter a username",e=!0),""==a.password&&(a.errorText.password="Enter a password",e=!0),""==a.email?(a.errorText.email="Enter an email",e=!0):/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(a.email)||(a.errorText.email="Invalid email",e=!0),""==a.firstName&&(a.errorText.first="Enter a first name",e=!0),""==a.lastName&&(a.errorText.last="Enter a last name",e=!0),""==a.studentID?(a.errorText.id="Enter an ID",e=!0):isNaN(a.studentID)&&(a.errorText.id="Invalid ID",e=!0),e},a.signup=function(){if(!a.isInputError()){var e={username:a.username,email:a.email,firstName:a.firstName,lastName:a.lastName,password:a.password,type:a.type};t.post("http://localhost:3000/api/auth/signup",e),n.dismiss("cancel")}},a.close=function(){n.dismiss("cancel")}}e.$inject=["GradeService","$http","$scope","$uibModalInstance"],angular.module("GradeTrack").controller("signupModalController",e)}(),function(){"use strict";angular.module("GradeTrack").service("StudentService",function(){this.students=[{last:"Smith",first:"James",grade:"80%",email:"SmithJ@unlv.nevada.edu",id:"11223344"},{last:"Williams",first:"Rebecca",grade:"85%",email:"WilliamsR@unlv.nevada.edu",id:"2244553322"},{last:"Aster",first:"Billy",grade:"66%",email:"AsterB@unlv.nevada.edu",id:"43233333"},{last:"Bills",first:"Derek",grade:"90%",email:"BillsD@unlv.nevada.edu",id:"1010101010"},{last:"Dillan",first:"Ben",grade:"45%",email:"DillanB@unlv.nevada.edu",id:"3428237420"}],this.list=function(){return this.students}})}(),function(){"use strict";angular.module("GradeTrack").service("InfoService",function(){var e=!1,t=!1,s=!1;this.toggleDisable1=function(){t=!t},this.toggleDisable2=function(){e=!e},this.toggleShow3=function(){s=!s},this.editInfoStatus=function(){return e},this.editInfoStatus=function(){return e},this.editInfoStatus=function(){return e}})}(),function(){"use strict";angular.module("GradeTrack").service("GradeService",function(){this.loggedIn=!0,this.lastName="Prof",this.firstName="name",this.gradeAverageArray=[],this.courseNameArray=[],this.courses=[],this.postLogin=function(){this.currentCourseID=0,this.currentAssignmentID=0,this.courses.length>0&&(this.activeCourse=this.courses[0])},this.addCourse=function(e){var t={name:e,expanded:!1,average:Math.round(100*(50*Math.random()+50))/100,id:this.courses.length,assignments:[],students:[],weights:[{name:"Test",weight:40},{name:"Quiz",weight:30},{name:"Homework",weight:30}]};return this.courses.push(t),this.gradeAverageArray.push(t.average),this.courseNameArray.push(t.name),t},this.currentCourseID=0,this.getActiveCourse=function(){return this.courses[this.currentCourseID]},this.setActiveCourse=function(e){this.currentCourseID=e,this.currentAssignmentID=0},this.currentAssignmentID=0,this.getActiveAssignment=function(){return this.getActiveCourse().assignments[this.currentAssignmentID]},this.setActiveAssignment=function(e){this.currentAssignmentID=e},this.purgeData=function(){this.lastName="",this.firstName="",this.courses=[],this.gradeAverageArray=[],this.courseNameArray=[]},this.addStudent=function(e,t,s){for(var n={name:t,studentID:s,id:e.students.length,assignmentGrades:[],oldAssignmentGrades:[],overallGrade:0},a=0;a<e.assignments.length;++a)n.assignmentGrades.push(0),n.oldAssignmentGrades.push(0);e.students.push(n)},this.randomDate=function(){var e=2016,t=1+4*Math.random(),s=1+30*Math.random();return new Date(e,t,s)},this.addAssignment=function(e,t,s,n){var a={name:s,description:t,datepickerOpen:!1,id:e.assignments.length,points:n,type:"Test",dueDate:this.randomDate(),gradeArray:[0,0,0,0,0]};a.gradeArray[4]=e.students.length;for(var i=0;i<e.students.length;++i)e.students[i].assignmentGrades.push(0),e.students[i].oldAssignmentGrades.push(0);e.assignments.push(a)};for(var e=0;5>e;++e){for(var t=this.addCourse("CS"+(460+e).toString()),s=0;5>s;++s)this.addAssignment(t,"Enter Description","Assignment "+s.toString(),500);for(var n=0;30>n;++n)this.addStudent(t,"Student "+n.toString(),1e6+s);for(var a=0;5>a;++a)t.assignments[a].gradeArray[4]=t.students.length}this.activeCourse=this.courses[0]})}(),function(){"use strict";function e(e,t){var s=this;s.isLoggedIn=function(){return e.loggedIn},s.login=function(){e.loggedIn=!0},s.logout=function(){e.loggedIn=!1},s.tabs=[{active:!0,label:"Information",url:"#/information"},{active:!1,label:"Assignments",url:"#/assignments"},{active:!1,label:"Students",url:"#/students"}],s.openLogin=function(e){t.open({animation:!0,templateUrl:"app/login/LoginModal.html",controller:"LoginModalController",controllerAs:"LoginModalController",size:e})},s.openSignup=function(e){t.open({animation:!0,templateUrl:"app/signup/signupModal.html",controller:"signupModalController",controllerAs:"signupModalController",size:e})},s.openAddClass=function(e){t.open({animation:!0,templateUrl:"app/AddClass/AddClassModal.html",controller:"AddClassModalController",controllerAs:"AddClassModalController",size:e})},s.activeTab=s.tabs[0],s.lastName=e.firstName,s.firstName=e.lastName,s.courses=function(){return e.courses},s.getActiveCourse=function(){return e.getActiveCourse()},s.setActiveCourse=function(t){e.setActiveCourse(t)},s.clickTab=function(e,t){s.setActiveCourse(e.id),s.activeTab.active=!1,s.activeTab=t,s.activeTab.active=!0},s.isActiveTab=function(e,t){return e==s.getActiveCourse()&&t.active}}e.$inject=["GradeService","$uibModal"],angular.module("GradeTrack").controller("MainController",e)}(),function(){"use strict";function e(e,t,s,n){var a=this;a.username="",a.password="",a.errorText={password:"",username:"",login:""},a.checkInputErrors=function(){a.errorText.password=a.errorText.username=a.errorText.login="";var e=!1;return""==a.username&&(a.errorText.username="Enter a username",e=!0),""==a.password&&(a.errorText.password="Enter a password",e=!0),e},a.login=function(){if(!a.checkInputErrors()){var s={username:a.username,password:a.password};t.post("http://localhost:3000/api/auth/signin",s).then(function(){e.postLogin(),e.loggedIn=!0,n.dismiss("cancel")},function(){a.errorText.login="Invalid login"}),a.close()}},a.close=function(){n.dismiss("cancel")}}e.$inject=["GradeService","$http","$scope","$uibModalInstance"],angular.module("GradeTrack").controller("LoginModalController",e)}(),function(){"use strict";function e(e,t){var s=this;s.activeCourse=function(){return t.getActiveCourse()}}e.$inject=["InfoService","GradeService"],angular.module("GradeTrack").controller("InformationController",e)}(),function(){"use strict";function e(){}angular.module("GradeTrack").controller("GradesController",e)}(),angular.module("GradeTrack").directive("timeline",function(){return{restrict:"E",replace:!0,template:"<div></div>",scope:{items:"=items",options:"=options"},link:function(e,t){new vis.Timeline(t[0],e.items,e.options)}}}),function(){"use strict";function e(e){var t=this;t.series=["Series A"],t.professorName=e.firstName+" "+e.lastName,t.studentsEnrolled=function(){for(var t=0,s=0;s<e.courses.length;++s)t+=e.courses[s].students.length;return t},t.createVisTimelineData=function(e){for(var t=[],s=0;s<e.assignments.length;++s){var n=e.assignments[s].dueDate,a=n.getFullYear()+"-"+n.getMonth()+"-"+n.getDate(),i={id:s+1,content:e.assignments[s].name,start:a};t.push(i)}return new vis.DataSet(t)},t.items=[];for(var s=0;s<e.courses.length;++s)t.items.push(t.createVisTimelineData(e.courses[s]));t.options={height:"150px",start:"2016-01-19",end:"2016-5-14"},t.getCourses=function(){return e.courses},t.getGradeArray=function(e){for(var t=[{grade:"A",amount:0},{grade:"B",amount:0},{grade:"C",amount:0},{grade:"D",amount:0},{grade:"F",amount:0}],s=0;s<e.students.length;++s){var n=0;n=e.students[s].average>=90?0:e.students[s].average>=80?1:e.students[s].average>=70?2:e.students[s].average>=60?3:4,++t[n].amount}return t},t.gradeAverageArray=[e.gradeAverageArray],t.courseNameArray=e.courseNameArray}e.$inject=["GradeService"],angular.module("GradeTrack").controller("DashboardController",e)}(),function(){"use strict";function e(e,t,s,n,a){var i=this;i.course=e.getActiveCourse(),i.email="",i.firstName="",i.lastName="",i.studentID="",i.errorText={email:"",id:"",first:"",last:""},i.isInputError=function(){i.errorText.first=i.errorText.last=i.errorText.email=i.errorText.id="";var e=!1;return""==i.email?(i.errorText.email="Enter an email",e=!0):/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(i.email)||(i.errorText.email="Invalid email",e=!0),""==i.firstName&&(i.errorText.first="Enter a first name",e=!0),""==i.lastName&&(i.errorText.last="Enter a last name",e=!0),""==i.studentID?(i.errorText.id="Enter an ID",e=!0):isNaN(i.studentID)&&(i.errorText.id="Invalid ID",e=!0),e},i.addStudent=function(){if(!i.isInputError()){var e={last:i.lastName,first:i.firstName,grade:"",email:i.email,id:i.studentID};a.students.push(e),i.close()}},i.close=function(){n.dismiss("cancel")}}e.$inject=["GradeService","$http","$scope","$uibModalInstance","StudentService"],angular.module("GradeTrack").controller("AddStudentModalController",e)}(),function(){"use strict";function e(e,t,s){var n=this;n.showDetails=!1,n.activeCourse=function(){return e.getActiveCourse()},n.activeAssignment=function(){return e.getActiveAssignment()},n.setActiveAssignment=function(t){e.setActiveAssignment(t)},n.clickAssignment=function(t){e.setActiveAssignment(t),n.showDetails=!0},n.openAddAssignment=function(e){s.open({animation:!0,templateUrl:"app/AddAssignment/AddAssignmentModal.html",controller:"AddAssignmentModalController",controllerAs:"AddAssignmentModalController",size:e})},n.SendModifiedDueDate=function(e){t.log("SendModifiedDueDate: "+e.name+" - "+e.dueDate)},n.SendModifiedGrade=function(e,s){t.log("SendModifiedGrade: "+s.name+" on "+e.name+" "+s.assignmentGrades[e.id])},n.SendModifiedPoints=function(e){t.log("SendModifiedPoints: "+e.name+" - "+e.points)},n.SendModifiedDescription=function(e){t.log("SendModifiedDescription: "+e.name+" - "+e.description)},n.SendModifiedAssignmentName=function(e){t.log("SendModifiedAssignmentName: "+e.name)},n.getGradeIndex=function(e){return e>=.9?0:e>=.8?1:e>=.7?2:e>=.6?3:4},n.changeGradeArray=function(e,t){var s=e.id,a=t.assignmentGrades[s],i=t.oldAssignmentGrades[s],r=4;null!=i&&(r=n.getGradeIndex(i/e.points));var o=4;null!=a&&(o=n.getGradeIndex(a/e.points)),--e.gradeArray[r],++e.gradeArray[o]},n.labelArray=["A","B","C","D","F"]}e.$inject=["GradeService","$log","$uibModal"],angular.module("GradeTrack").controller("AssignmentsController",e)}(),function(){"use strict";function e(e,t,s,n){var a=this;a.course=e.getActiveCourse(),a.assignmentDescription="",a.assignmentName="",a.points=0,a.errorText="",a.addAssignment=function(){return a.errorText="",""==a.assignmentName?void(a.errorText="Enter an assignment name"):(e.addAssignment(a.course,a.assignmentDescription,a.assignmentName,a.points),void a.close())},a.close=function(){a.assignmentDescription="",a.assignmentName="",a.points=0,n.dismiss("cancel")}}e.$inject=["GradeService","$http","$scope","$uibModalInstance"],angular.module("GradeTrack").controller("AddAssignmentModalController",e)}(),function(){"use strict";function e(e,t,s,n){var a=this;a.close=function(){a.studentString="",a.courseName="",a.students=[],a.showError=!1,n.dismiss("cancel")},a.courseName="",a.students=[],a.studentString="",a.description="",a.errorText="",a.createCourse=function(){a.errorText="";var s;if(""==a.courseName)return void(a.errorText="Enter a course name");var n=e.addCourse(a.courseName);for(s=0;s<a.students.length;++s)e.addStudent(n,a.students[s].name,0);var i={title:a.courseName,students:[],instructor:"",description:a.description};for(s=0;s<a.students.length;++s)i.students.push(a.students[s].name);i.instructor=e.firstName+" "+e.lastName,t.post("http://localhost:3000/api/info/addstudents",{title:i.title,students:i.students,insName:i.instructor}),a.close()},a.addStudent=function(e){var t={name:e,id:a.students.length};a.students.push(t)},a.removeStudent=function(e){var t=a.students.indexOf(e);t>-1&&a.students.splice(t,1)},a.addMultipleStudents=function(){if(""!=a.studentString){for(var e=a.studentString,t=e.split(","),s=0;s<t.length;++s)a.addStudent(t[s]);a.studentString=""}}}e.$inject=["GradeService","$http","$scope","$uibModalInstance"],angular.module("GradeTrack").controller("AddClassModalController",e)}(),function(){"use strict";function e(e){e.debug("runBlock end")}e.$inject=["$log"],angular.module("GradeTrack").run(e)}(),function(){"use strict";function e(e){e.when("/",{templateUrl:"app/dashboard/dashboard.html",controller:"DashboardController",controllerAs:"dashboardCtrl"}).when("/information",{templateUrl:"app/information/information.html",controller:"InformationController",controllerAs:"information"}).when("/assignments",{templateUrl:"app/assignments/assignments.html",controller:"AssignmentsController",controllerAs:"assignments"}).when("/students",{templateUrl:"app/students/students.html",controller:"StudentsController",controllerAs:"students"}).otherwise({redirectTo:"/"})}e.$inject=["$routeProvider"],angular.module("GradeTrack").config(e)}(),function(){"use strict";angular.module("GradeTrack").constant("malarkey",malarkey).constant("moment",moment)}(),function(){"use strict";function e(e,t){e.debugEnabled(!0),t.allowHtml=!0,t.timeOut=3e3,t.positionClass="toast-top-right",t.preventDuplicates=!0,t.progressBar=!0}e.$inject=["$logProvider","toastrConfig"],angular.module("GradeTrack").config(e)}(),angular.module("GradeTrack").run(["$templateCache",function(e){e.put("app/AddAssignment/AddAssignmentModal.html",'<div class=modal-header><h1 class=modal-addClassHeader>Add Assignment</h1><a href="" class=modal-closebutton ng-click=AddAssignmentModalController.close()>x</a></div><div class=modal-body><ul style=list-style:none><li class=modal-inputwrapper><div class=row><div class=col-md-6><div class=modal-infoheader>ASSIGNMENT NAME</div><div><input class=modal-username-input ng-model=AddAssignmentModalController.assignmentName type=text placeholder="Assignment Name"> <span class=modal-errortext>{{AddAssignmentModalController.errorText}}</span></div></div><div class=col-md-6><div class=modal-infoheader>POINTS</div><div><input class=modal-username-input ng-model=AddAssignmentModalController.points type=number></div></div></div></li><li class=modal-inputwrapper><div class=row><div class=col-md-12><div class=modal-infoheader>DESCRIPTION</div><div><textarea ng-model=AddAssignmentModalController.assignmentDescription maxlength=1000 style="margin-left:-40px; margin-top:5px; display:inline;  width:calc(100% + 40px);  resize:none;  height:100px">\n          </textarea></div></div></div></li><li style=height:20px><button class="btn btn-primary" style=float:right ng-click=AddAssignmentModalController.addAssignment()>Add Assignment</button></li></ul></div>'),e.put("app/AddClass/AddClassModal.html",'<div class=modal-header><h1 class=modal-addClassHeader>Add Course</h1><a href="" class=modal-closebutton ng-click=AddClassModalController.close()>x</a></div><div class=modal-body><ul style=list-style:none><li class=modal-inputwrapper><div class=modal-infoheader>COURSE NAME</div><div><input class=modal-username-input ng-model=AddClassModalController.courseName type=text placeholder="Course Name"> <span class=modal-errortext>{{AddClassModalController.errorText}}</span></div></li><li class=modal-inputwrapper><div class=modal-infoheader>DESCRIPTION</div><textarea ng-model=AddClassModalController.description class=modal-coursedescription></textarea></li><li class=modal-inputwrapper><div class=modal-infoheader>STUDENTS</div><div><div class=modal-studentbox><ul><li><input class=modal-addStudentsInput type=text ng-model=AddClassModalController.studentString placeholder="Enter students, separated by commas"> <button class="btn btn-block modal-addStudentsButton" ng-click=AddClassModalController.addMultipleStudents()>Add Student(s)</button></li><li ng-repeat="student in AddClassModalController.students"><input class=modal-studentnameinput placeholder=name@institution.edu ng-model=student.name> <a href="" class=modal-removestudent ng-click=AddClassModalController.removeStudent(student)>x</a></li></ul></div></div></li><li style=height:20px><button class="btn btn-primary" style=float:right ng-click=AddClassModalController.createCourse()>Add Course</button></li></ul></div>'),e.put("app/AddStudent/AddStudentModal.html",'<div class=modal-header><h1 class=modal-addClassHeader>Add Student</h1><a href="" class=modal-closebutton ng-click=AddStudentModalController.close()>x</a></div><div class=modal-body><ul style=list-style:none><li class=modal-inputwrapper><div class=row><div class=col-md-6><div class=modal-infoheader>FIRST NAME</div><div><input class=modal-username-input ng-model=AddStudentModalController.firstName type=text placeholder="First Name"> <span class=modal-errortext>{{AddStudentModalController.errorText.first}}</span></div></div><div class=col-md-6><div class=modal-infoheader>LAST NAME</div><div><input class=modal-username-input ng-model=AddStudentModalController.lastName type=text placeholder="Last Name"> <span class=modal-errortext>{{AddStudentModalController.errorText.last}}</span></div></div></div></li><li class=modal-inputwrapper><div class=modal-infoheader>STUDENT ID</div><div><input class=modal-username-input ng-model=AddStudentModalController.studentID type=text placeholder="Student ID"> <span class=modal-errortext>{{AddStudentModalController.errorText.id}}</span></div></li><li class=modal-inputwrapper><div class=modal-infoheader>STUDENT EMAIL</div><div><input class=modal-username-input ng-model=AddStudentModalController.email type=text placeholder=name@institution.edu> <span class=modal-errortext>{{AddStudentModalController.errorText.email}}</span></div></li><li style=height:20px><button class="btn btn-primary" style=float:right ng-click=AddStudentModalController.addStudent()>Add Student</button></li></ul></div>'),e.put("app/assignments/assignments.html",'<div style="height:100%; width:100%"><div class=assignments-wrapper><div class=assignments-full-left-area><div ng-class="!assignments.showDetails ? \'assignments-leftside\' : \'assignments-leftside-small\'"><div class=assignments-leftbox><div class=assignments-header><div class=assignments-coursename>{{assignments.activeCourse().name}}</div></div><button class="btn btn-positive assignments-addassignmentbutton" ng-click="assignments.openAddAssignment(\'lg\')">Add Assignment</button><div class=assignmentName-background><ul class=assignments-assignmentlist><li ng-repeat="assignment in assignments.activeCourse().assignments"><div class=assignment-assignlistwrapper><div class=assignments-assignmentname><label for=assignmentInput></label><input maxlength=20 id=assignmentInput class=leftside-assignmentname-input type=text ng-model=assignment.name ng-click=assignments.clickAssignment(assignment.id) ng-blur=assignments.SendModifiedAssignmentName(assignment)></div><div class=calendarWrapper><button type=button class="btn btn-default" ng-click="assignment.datepickerOpen=true"><i class="glyphicon glyphicon-calendar"></i></button></div><div class=calendarInput><input type=text class=form-control uib-datepicker-popup=fullDate ng-model=assignment.dueDate is-open=assignment.datepickerOpen datepicker-options=dateOptions datepicker-append-to-body=true ng-required=true close-text=Close alt-input-formats=altInputFormats></div></div></li></ul></div></div></div></div><div class=assignments-full-right-area ng-show=assignments.showDetails><div ng-class="assignments.showDetails ? \'assignments-rightside-on\' : \'assignments-rightside-off\'"><div class=assignments-rightbox><div class=rightbox-Header><input maxlength=20 size=20 id=assignmentInput type=text ng-model=assignments.activeAssignment().name ng-blur=assignments.SendModifiedAssignmentName(assignments.activeAssignment())> <a href="" ng-click="assignments.showDetails=false">x</a></div><div class=rightbox-descriptionTitle><h4>Description</h4></div><div class=rightbox-descriptioninput><textarea ng-model=assignments.activeAssignment().description ng-blur=assignments.SendModifiedDescription(assignments.activeAssignment()) maxlength=1000></textarea></div><div class=rightbox-piechart><canvas height=100% width=100% id=pie class="chart chart-pie" chart-data=assignments.activeAssignment().gradeArray chart-labels=assignments.labelArray></canvas></div><hr class=rightbox-divider><div class=rightbox-pointswrapper><span>Points: <input type=number min=0 ng-model=assignments.activeAssignment().points ng-blur=assignments.SendModifiedPoints(assignments.activeAssignment())> </span><span style="margin-top:1px; float:right; margin-right:32px"><button class="btn btn-sm btn-primary">Submit</button></span></div><hr class=rightbox-divider><h4 class=rightbox-gradesheader>Grades</h4><div class=rightbox-gradesarea><ul><li ng-repeat="student in assignments.activeCourse().students"><span class=rightbox-studentname>{{student.name}}</span><div class=rightbox-studentGradeWrapper><span>{{student.assignmentGrades[assignments.activeAssignment().id] / assignments.activeAssignment().points * 100 | number:2}}%</span> <input type=number min=0 ng-model=student.assignmentGrades[assignments.activeAssignment().id] , ng-focus="student.oldAssignmentGrades[assignments.activeAssignment().id] = student.assignmentGrades[assignments.activeAssignment().id]" ng-blur="assignments.changeGradeArray(assignments.activeAssignment(), student); assignments.SendModifiedGrade(assignments.activeAssignment(), student)"></div></li></ul></div></div></div></div></div></div>'),e.put("app/dashboard/dashboard.html",'<div style="overflow-y:auto; width:100%; height:100%; position:absolute; overflow-x:hidden; background:lightblue; padding-left:10px; padding-right:10px; padding-bottom:10px"><!--card--><div class=row style="margin-top:10px; margin-left:5px; margin-right:5px; margin-bottom:10px"><div class=col-md-12 style="background:white; border-radius:20px"><div class=row><div class=col-md-6><h1>Welcome, {{dashboardCtrl.professorName}}</h1><ul><li><h3>Classes managed: {{dashboardCtrl.getCourses().length}}</h3></li><li><h3>Total students enrolled: {{dashboardCtrl.studentsEnrolled()}}</h3></li></ul></div><div class=col-md-6><h1 style=text-align:center>Your class averages</h1><canvas id=bar class="chart chart-bar" chart-data=dashboardCtrl.gradeAverageArray chart-labels=dashboardCtrl.courseNameArray chart-series=dashboardCtrl.series></canvas></div></div></div></div><div class=row ng-repeat="course in dashboardCtrl.getCourses()" style="margin-top:10px; margin-left:5px; margin-right:5px; margin-bottom:10px"><div class=col-md-12 style="background:white; border-radius:20px"><div class=row><div class=col-md-10><h1>{{course.name}}</h1><h3>Students: {{ course.students.length }}</h3><div style="padding-bottom:10px; width:110%"><timeline items=dashboardCtrl.items[$index] options=dashboardCtrl.options></timeline></div></div><div class=col-md-2><div class=row><div class=col-md-12 style=text-align:right><h4>Grade breakdown</h4></div></div><ul style=list-style:none><li ng-repeat="i in [0,1,2,3,4]"><div class=col-md-12><h5 style=float:right>{{dashboardCtrl.getGradeArray(course)[i].grade}}: {{dashboardCtrl.getGradeArray(course)[i].amount}}</h5></div></li></ul></div></div></div></div></div>'),e.put("app/grades/grades.html",'<head><style>table, th, td{\n      border: 1px solid grey;\n      border-collapse: collapse;\n      padding: 5px;\n    }\n\n    table tr:nth-child(odd){\n      background-color: #f2f2f2;\n    }\n\n    table tr:nth-child(even){\n      background-color: #ffffff;\n    }</style></head><body><h2>Grades for Students</h2><div ng-controller=GradesController as vm style="100%; width:100%"><table border=0><tr><td>Last Name</td><td>First Name</td><td>Grade Percentage</td><td>Grade Letter</td></tr><tr ng-repeat="course in courses.student460"><td>{{student46.first}}</td><td>{{student46.last}}</td><td>{{student46.percent}}</td><td>{{student46.letter}}</td></tr></table><div class=grades-wrapper></div></div></body>'),e.put("app/information/information.html",'<div ng-controller="InformationController as vm" style="height:100%; width:100%"><div class=information-wrapper><div class=information-full-main-area><div class=information-main><div style="overflow:hidden; border-radius:10px; padding-left:10px; padding-right:10px; background:#e9eef5; border:thin solid #000000; position:relative; left:0; width:100%; top:0; height:100%"><div style="background:#d4e4fa; border-bottom:thin solid #000000;  height:35px; margin-left:-10px; margin-right:-10px"><div style="padding-top:4px; padding-left:10px;font-size:20px">{{vm.activeCourse().name}}</div></div><div style="margin-top:10px; margin-bottom:10px; height:calc(100vh - 170px); overflow:auto; background:#FFFFFF"><!-- Main content --><!-- Information Area --><!-- Section of class information  --><section><div class=col-xs-9><div class=infoHeader><h3>Class {{classInfo.id}} - {{classInfo.name}} <button type=button class="btn btn-default infoButton" ng-click=toggleDisable1()><span class="glyphicon glyphicon-edit"></span></button></h3></div><div class=infoSection><label>Desption:</label><br><textarea id=classInfo rows=8 cols=100 ng-disabled=!editDes>{{classInfo.info}}</textarea><br><br><!-- <input type="submit" ng-disabled="!editInfo" ng-click="toggleDisable1()"> --></div></div></section><!-- Section for Instructor --><section class=col-xs-9><div class=infoHeader><h3>Instructor Information<lable><button type=button class="btn btn-default infoButton" ng-click=toggleDisable2()><span class="glyphicon glyphicon-edit"></span></button></lable></h3></div><div class=infoSection><label><ul class=list-group><br><li class=list-group-item>Name: <input type=text value="{{profile.firstName}}{{profile.lastName}} " ng-disabled=!editInfo><br></li><br><li class=list-group-item>Email: <input type=text value={{profile.email}} ng-disabled=!editInfo><br></li><br><li class=list-group-item>Phone: <input type=text value={{profile.email}} ng-disabled=!editInfo><br></li><br><li class=list-group-item>Office Houes: <input type=text value={{profile.office}} ng-disabled=!editInfo> <input type=text value={{profile.hours}} ng-disabled=!editInfo><br></li><!-- <input type="submit" ng-disabled="!editInfo" ng-click="toggleDisable2()"> --></ul></label></div></section><!-- Section for TA   (the bottom not works yet)--><section class=col-xs-9><div class=infoHeader><h3>Teacher\'s Assistant<lable><button type=button class="btn btn-default infoButton" ng-click=toggleDisable3()><span class="glyphicon glyphicon-plus"></span></button></lable></h3></div><div class=infoSection ng-show=!ShowTab><lable><ul class=list-group><br><li class=list-group-item>Name: <input type=text value="{{profile.firstName}}{{profile.lastName}} " ng-disabled=!editInfo><br></li><br><li class=list-group-item>Email: <input type=text value={{profile.email}} ng-disabled=!editInfo><br></li></ul></lable></div></section></div></div></div></div></div></div>'),e.put("app/login/LoginModal.html",'<div class=modal-header><h1 style="margin-top:10px; text-align:center">Log In</h1><a href="" class=modal-closebutton ng-click=LoginModalController.close()>x</a></div><div class=modal-body><ul style=list-style:none><li class=modal-inputwrapper><div class=modal-infoheader>EMAIL ADDRESS</div><div><input class=modal-password-input type=text ng-model=LoginModalController.username placeholder=name@company.com> <span class=modal-errortext style=margin-left:-40px>{{LoginModalController.errorText.username}}</span></div></li><li class=modal-inputwrapper><div class=modal-infoheader>PASSWORD</div><div><input class=modal-password-input type=password ng-model=LoginModalController.password placeholder=Password> <span class=modal-errortext style=margin-left:-40px>{{LoginModalController.errorText.password}}</span></div></li><li style=height:20px><span class=modal-errortext style="position:absolute; left:15px; bottom:20px">{{LoginModalController.errorText.login}}</span> <button class="btn btn-primary" style=float:right ng-click=LoginModalController.login()>Log In</button></li></ul></div>'),e.put("app/signup/signupModal.html",'<div class=modal-header><h1 style="margin-top:10px; text-align:center">Sign Up</h1><a href="" class=modal-closebutton ng-click=signupModalController.close()>x</a></div><div class=modal-body><ul style=list-style:none><li class=modal-inputwrapper><div class=row><div class=col-md-6><div class=modal-infoheader>FIRST NAME</div><div><input class=modal-username-input type=text ng-model=signupModalController.firstName placeholder=""> <span class=modal-errortext>{{signupModalController.errorText.first}}</span></div></div><div class=col-md-6><div class=modal-infoheader>LAST NAME</div><div><input class=modal-username-input type=text ng-model=signupModalController.lastName placeholder=""> <span class=modal-errortext>{{signupModalController.errorText.last}}</span></div></div></div></li><li class=modal-inputwrapper><div class=row><div class=col-md-6><div class=modal-infoheader>USERNAME</div><div><input class=modal-username-input type=text ng-model=signupModalController.username placeholder=Username> <span class=modal-errortext>{{signupModalController.errorText.username}}</span></div></div><div class=col-md-6><div class=modal-infoheader>STUDENT ID</div><div><input class=modal-username-input type=text ng-model=signupModalController.studentID placeholder=""> <span class=modal-errortext>{{signupModalController.errorText.id}}</span></div></div></div></li><li class=modal-inputwrapper><div class=row><div class=col-md-6><div class=modal-infoheader>EMAIL ADDRESS</div><div><input class=modal-username-input type=text ng-model=signupModalController.email placeholder=name@company.com> <span class=modal-errortext>{{signupModalController.errorText.email}}</span></div></div><div class=col-md-6><div class=modal-infoheader>ACCOUNT TYPE</div><div style=margin-left:-40px class=btn-group data-toggle=buttons><label ng-class="signupModalController.type==\'student\' ? \'btn btn-primary\' : \'btn btn-primary active\'"><input type=radio name=options ng-model=signupModalController.type value=instructor autocomplete=off checked> Instructor</label><label ng-class="signupModalController.type==\'student\' ? \'btn btn-primary active\' : \'btn btn-primary\'"><input type=radio name=options ng-model=signupModalController.type value=student autocomplete=off> Student</label></div></div></div></li><li class=modal-inputwrapper><div class=modal-infoheader>PASSWORD</div><div><input class=modal-username-input type=password ng-model=signupModalController.password placeholder=Password> <span class=modal-errortext>{{signupModalController.errorText.password}}</span></div></li><li style=height:20px><button class="btn btn-primary" style=float:right ng-click=signupModalController.signup()>Sign Up</button></li></ul></div>'),e.put("app/students/students.html",'<div ng-controller="StudentsController as vm" style="height:100%; width:100%"><div class=students-wrapper><div class=students-full-main-area><div class=students-main><div style="overflow:hidden; border-radius:10px; padding-left:10px; padding-right:10px; background:#e9eef5; border:thin solid #000000; position:relative; left:0; width:100%; top:0; height:100%"><div style="background:#d4e4fa; border-bottom:thin solid #000000;  height:35px; margin-left:-10px; margin-right:-10px"><div style="padding-top:4px; padding-left:10px;font-size:20px">{{vm.activeCourse().name}}</div><div><button ng-click="students.openAddStudentModal(\'lg\')" class="btn btn-primary btn-sm" style="position:absolute; right:5px; top:2px">Add Student</button></div></div><div style="margin-top:10px; margin-bottom:10px; height:calc(100vh - 170px); overflow:auto; background:#d1c4e9; box-shadow: 10px 10px 5px #888888"><!--Switching to BS table--><table class="table table-striped"><thead><tr><th>Last Name</th><th>First Name</th><th>Grade</th><th>E-mail</th><th>ID</th></tr></thead><tbody><tr ng-repeat="student in students.list()"><td>{{student.last}}</td><td>{{student.first}}</td><td>{{student.grade}}</td><td>{{student.email}}</td><td>{{student.id}}</td><td><button class="btn btn-danger btn-sm glyphicon glyphicon-remove students-removebutton" ng-click=students.removeStudent(student)></button></td></tr></tbody></table></div></div></div></div></div></div>');
}]);
//# sourceMappingURL=../maps/scripts/app-8510be7361.js.map
