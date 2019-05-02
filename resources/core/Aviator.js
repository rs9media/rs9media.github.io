var Website = function() {
    //Global reference
    var self = this;
    //Constructor
    self.constructor = function() {
        //Set page title
        self.System.setPageTitle("");
        //Bind events to menu
        $(".navbar #About,#bottomMenu #About").click(function(){
			self.About.Main();
			//Shift focus to the #stage
			//$("#stage").goTo();
		});
        $(".navbar #Contact,#bottomMenu #Contact").click(self.Contact.Main);
        $(".navbar #Mission,#bottomMenu #Mission").click(self.Mission.Main);
        $(".navbar #Assignments,#bottomMenu #Assignments").click(self.Assignments.Main);
		$(".navbar a,#bottomMenu a").click(function(){
			//Make everything look normal
			$(".service").css({
				"color":"black",
				"background":"white"
			});
		});

		$(".service").click(function(){
			self.About.renderServiceInformation($(this));
		});
        //Define AGX Handle
        self.agxHandle = new AGX({
            "apiEndpoint":"Aviator",
            "apiUrl":"http://api.asgardia.io",
            "apiKey":"b1e2b9023e5836857ff716271fbdc660"
        });
		//Boot
		setTimeout(self.System.bootSequence,300);
    };
    //System
    self.System = {
        "setPageTitle": function(titleText) {
            $(".pageTitle").text(titleText);
        },
        "loadView": function(viewName) {
			//Do the thing
            return "resources/views/" + viewName + "?version=" + Math.random();
        },
		"bootSequence":function(){
            switch(window.location.hash.replace("#","")){
				case "insight":
					self.Insight.Main();
				break;
				default:
					self.Assignments.Main();
				break;
			}

         	$("#getStartedButton").click(function(){
				//Grab the formData
				var formData = self.agxHandle.Utility.extractFormDataObject("#contactForm");
				formData["message"] = $("#message").val();
         		//Send the formData
         		self.agxHandle.Core.processClientData(formData,"processContactForm",function(responseObject){
         			alert(responseObject.status);
         		});
         	});
		}
    };
    //Insight
	self.Insight = {
		"Main":function(){
            //Clear the deck
            $("#stage").load(self.System.loadView("Insight/main.htm"),function(){

            });
		}
	};
    //About
	self.About = {
		"Main":function(noScroll){
            //Clear the deck
            $("#stage").clearTheDeck().load(self.System.loadView("About/main.htm"));
			//Shift focus to the #stage
			////$("#stage").goTo();
		},
		"renderServiceInformation":function(service){
			//Make everything look normal
			$(service).siblings().css({
				"color":"black",
				"background":"white"
			});
			//Make the clicked service look special
			$(service).css({
				"color":"#fff",
				"background":"#0e182d"
			});
			//Clear the deck
            $("#stage").empty().load(self.System.loadView("About/service.htm"),function(){
				//Do the thing
				self.agxHandle.Core.executeDataPathway("renderServiceInformation:" + $(service).text(), function(response) {
					////$("#stage").goTo();
					$("#stage").find("#text").text(response.text);
					$("#stage").find("#icon").addClass(response.icon);
				});
			});
		}
	};
    //Mission
	self.Mission = {
		"Main":function(){
            //Clear the deck
            $("#stage").clearTheDeck().load(self.System.loadView("Mission/main.htm"));
			//Shift focus to the #stage
			//$("#stage").goTo();
		}
	};
    //Assignments
	self.Assignments = {
		"Main":function(){
            //Clear the deck
            $("#stage").clearTheDeck().load(self.System.loadView("Assignments/main.htm"));
			//Shift focus to the #stage
			//$("#stage").goTo();
		}
	};
    //Contact
	self.Contact = {
		"Main":function(){
			//Shift focus to the #stage
			$("form#contactForm").goTo();
		}
	};

    //Do the thing
    self.constructor();
}

var Aviator = new Website();
