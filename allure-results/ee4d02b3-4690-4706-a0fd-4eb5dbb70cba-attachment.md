# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: createUserProfile.spec.js >> User 4: Test Case
- Location: tests\createUserProfile.spec.js:10:3

# Error details

```
Error: Step 2 fill failed: fill "workEmail" failed: locator.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('#employeeForm_email')

```

# Page snapshot

```yaml
- generic:
  - generic:
    - main:
      - generic [ref=e1]:
        - complementary [ref=e2]:
          - generic [ref=e4]:
            - menu [ref=e7]:
              - menuitem "Home" [ref=e8] [cursor=pointer]:
                - img [ref=e9]
                - link "Home" [ref=e15]:
                  - /url: /dashboard
              - menuitem "Employee Directory" [ref=e16] [cursor=pointer]:
                - img [ref=e17]
                - link "Employee Directory" [ref=e22]:
                  - /url: /employee-management
              - menuitem "Attendance" [ref=e23] [cursor=pointer]:
                - img [ref=e24]
                - generic [ref=e28]: Attendance
              - menuitem "Timesheet" [ref=e29] [cursor=pointer]:
                - img [ref=e30]
                - link "Timesheet" [ref=e34]:
                  - /url: /project-timeline
              - menuitem "Leave Management" [ref=e35] [cursor=pointer]:
                - img [ref=e36]
                - link "Leave Management" [ref=e40]:
                  - /url: /leaves
              - menuitem "Visit & Geo Tracking" [ref=e41] [cursor=pointer]:
                - img [ref=e42]
                - generic [ref=e45]: Visit & Geo Tracking
              - menuitem "Document Management" [ref=e46] [cursor=pointer]:
                - img [ref=e47]
                - link "Document Management" [ref=e52]:
                  - /url: /directory
              - menuitem "Ticket Management" [ref=e53] [cursor=pointer]:
                - img [ref=e54]
                - link "Ticket Management" [ref=e57]:
                  - /url: /tickets
              - menuitem "Asset Management" [ref=e58] [cursor=pointer]:
                - img [ref=e59]
                - generic [ref=e63]: Asset Management
              - menuitem "Company Policies" [ref=e64] [cursor=pointer]:
                - img [ref=e65]
                - link "Company Policies" [ref=e69]:
                  - /url: /organizationPolicy
              - menuitem "Employee Agreements" [ref=e70] [cursor=pointer]:
                - img [ref=e71]
                - link "Employee Agreements" [ref=e77]:
                  - /url: /agreement
              - menuitem "Task Management" [ref=e78] [cursor=pointer]:
                - img [ref=e79]
                - link "Task Management" [ref=e83]:
                  - /url: /taskManagement/board
              - menuitem "Requisition" [ref=e84] [cursor=pointer]:
                - img [ref=e85]
                - link "Requisition" [ref=e89]:
                  - /url: /requisition
              - menuitem "Offboarding" [ref=e90] [cursor=pointer]:
                - img [ref=e91]
                - link "Offboarding" [ref=e96]:
                  - /url: /offboarding
              - menuitem "Digital Onboarding" [ref=e97] [cursor=pointer]:
                - img [ref=e98]
                - generic [ref=e100]: Digital Onboarding
              - menuitem "Expense Management" [ref=e101] [cursor=pointer]:
                - img [ref=e102]
                - generic [ref=e106]: Expense Management
              - menuitem "Payroll Management" [ref=e107] [cursor=pointer]:
                - img [ref=e108]
                - generic [ref=e112]: Payroll Management
              - menuitem "Performance Management" [ref=e113] [cursor=pointer]:
                - img [ref=e114]
                - generic [ref=e118]: Performance Management
              - menuitem "Approvals" [ref=e119] [cursor=pointer]:
                - img [ref=e120]
                - link "Approvals" [ref=e124]:
                  - /url: /approvals
              - menuitem "Reports" [ref=e125] [cursor=pointer]:
                - img [ref=e126]
                - link "Reports" [ref=e130]:
                  - /url: /reports
              - menuitem "Admin Settings" [ref=e131] [cursor=pointer]:
                - img [ref=e132]
                - generic [ref=e140]: Admin Settings
              - menuitem "Billing" [ref=e141] [cursor=pointer]:
                - img [ref=e142]
                - link "Billing" [ref=e146]:
                  - /url: /billing
              - menuitem "Help & Support" [ref=e147] [cursor=pointer]:
                - img [ref=e148]
                - link "Help & Support" [ref=e154]:
                  - /url: /helpAndSupport
            - button "menu-fold" [ref=e157] [cursor=pointer]:
              - img "menu-fold" [ref=e158]:
                - img [ref=e159]
        - generic [ref=e161]:
          - generic [ref=e163]:
            - img "logo" [ref=e165] [cursor=pointer]
            - generic [ref=e166]:
              - img [ref=e170] [cursor=pointer]
              - img [ref=e181] [cursor=pointer]
              - img [ref=e187] [cursor=pointer]
              - generic [ref=e190]:
                - button "00:00:00 Punch In" [ref=e194] [cursor=pointer]:
                  - generic: 00:00:00
                  - generic [ref=e195]:
                    - generic: Punch In
                - generic [ref=e199] [cursor=pointer]: S
          - main [ref=e200]:
            - generic [ref=e202]:
              - tablist [ref=e203]:
                - generic [ref=e205]:
                  - tab "Employee Analytics" [ref=e207] [cursor=pointer]:
                    - img [ref=e208]
                    - text: Employee Analytics
                  - generic:
                    - tab [disabled]
                  - tab "Employee List" [selected] [ref=e213] [cursor=pointer]:
                    - img [ref=e214]
                    - text: Employee List
              - tabpanel "Employee List" [ref=e221]:
                - generic [ref=e223]:
                  - img "filter" [ref=e225] [cursor=pointer]:
                    - img [ref=e226]
                  - radiogroup "segmented control" [ref=e228]:
                    - generic [ref=e229]:
                      - generic [ref=e230] [cursor=pointer]:
                        - radio
                        - img [ref=e233]
                      - generic [ref=e235] [cursor=pointer]:
                        - radio [checked]
                        - img [ref=e238]
                  - generic [ref=e241] [cursor=pointer]:
                    - generic [ref=e243]:
                      - combobox [ref=e245]
                      - generic "All Users" [ref=e246]
                    - generic:
                      - img
                  - button "organization View Organization" [ref=e247] [cursor=pointer]:
                    - img "organization" [ref=e248]
                    - generic [ref=e249]: View Organization
                  - button "Add Employee" [ref=e250] [cursor=pointer]:
                    - generic [ref=e251]: Add Employee
                - generic [ref=e253]:
                  - generic [ref=e256] [cursor=pointer]:
                    - generic [ref=e257]:
                      - generic [ref=e259]:
                        - generic [ref=e260]: Absent
                        - generic [ref=e261]:
                          - img [ref=e262]
                          - img [ref=e266]
                          - img [ref=e269]
                      - generic [ref=e275]: AU
                    - generic [ref=e276]:
                      - heading "A User - COL-0002" [level=5] [ref=e277]
                      - generic "info@techsuperiors.com" [ref=e278]
                      - generic [ref=e280]: Software Developer
                      - generic "Phone number missing" [ref=e281]:
                        - img [ref=e282]
                      - generic [ref=e284]:
                        - img [ref=e286]
                        - generic [ref=e288]: Online
                  - generic [ref=e291] [cursor=pointer]:
                    - generic [ref=e292]:
                      - generic [ref=e294]:
                        - generic [ref=e295]: Absent
                        - generic [ref=e296]:
                          - img [ref=e297]
                          - img [ref=e301]
                          - img [ref=e304]
                      - generic [ref=e310]: S
                    - generic [ref=e311]:
                      - heading "Sai - COL-0004" [level=5] [ref=e312]
                      - generic "harshith.bonta@techsuperiors.com" [ref=e313]
                      - generic [ref=e315]: "-"
                      - generic "Phone number missing" [ref=e316]:
                        - img [ref=e317]
                      - generic [ref=e319]:
                        - img [ref=e321]
                        - generic [ref=e323]: Away
                  - generic [ref=e326] [cursor=pointer]:
                    - generic [ref=e327]:
                      - generic [ref=e329]:
                        - generic [ref=e330]: Absent
                        - generic [ref=e331]:
                          - img [ref=e332]
                          - img [ref=e336]
                          - img [ref=e339]
                      - img [ref=e347]
                    - generic [ref=e348]:
                      - heading "Affan Rao - COL-0005" [level=5] [ref=e349]
                      - generic "affan.rao@techsuperiors.com" [ref=e350]
                      - generic [ref=e352]: Software Developer
                      - generic "Phone number missing" [ref=e353]:
                        - img [ref=e354]
                      - generic [ref=e356]:
                        - img [ref=e358]
                        - generic [ref=e360]: Away
                  - generic [ref=e363] [cursor=pointer]:
                    - generic [ref=e364]:
                      - generic [ref=e366]:
                        - generic [ref=e367]: Absent
                        - generic [ref=e368]:
                          - img [ref=e369]
                          - img [ref=e373]
                          - img [ref=e376]
                      - generic [ref=e382]: SQ
                    - generic [ref=e383]:
                      - heading "Sadiya Q Qamar - COL-0006" [level=5] [ref=e384]
                      - generic "sadiya.qamar@techsuperiors.com" [ref=e385]
                      - generic [ref=e387]: HR Business Partner
                      - generic [ref=e388]: +91 9828377238
                      - generic [ref=e389]:
                        - img [ref=e391]
                        - generic [ref=e393]: Online
                  - generic [ref=e396] [cursor=pointer]:
                    - generic [ref=e397]:
                      - generic [ref=e399]:
                        - generic [ref=e400]: Absent
                        - generic [ref=e401]:
                          - img [ref=e402]
                          - img [ref=e406]
                          - img [ref=e409]
                      - generic [ref=e415]: R
                    - generic [ref=e416]:
                      - heading "Riya - COL-0007" [level=5] [ref=e417]
                      - generic "riya@gmail.com" [ref=e418]
                      - generic [ref=e420]: "-"
                      - generic "Phone number missing" [ref=e421]:
                        - img [ref=e422]
                      - generic [ref=e424]:
                        - img [ref=e426]
                        - generic [ref=e428]: Offline
                  - generic [ref=e431] [cursor=pointer]:
                    - generic [ref=e432]:
                      - generic [ref=e434]:
                        - generic [ref=e435]: Absent
                        - generic [ref=e436]:
                          - img [ref=e437]
                          - img [ref=e441]
                          - img [ref=e444]
                      - generic [ref=e450]: S
                    - generic [ref=e451]:
                      - heading "Samay - COL-0012" [level=5] [ref=e452]
                      - generic "shrishti.semwal+dev1234@techsuperiors.com" [ref=e453]
                      - generic [ref=e455]: IT Director
                      - generic [ref=e456]: +91 9876543234
                      - generic [ref=e457]:
                        - img [ref=e459]
                        - generic [ref=e461]: Offline
                  - generic [ref=e464] [cursor=pointer]:
                    - generic [ref=e465]:
                      - generic [ref=e467]:
                        - generic [ref=e468]: Absent
                        - generic [ref=e469]:
                          - img [ref=e470]
                          - img [ref=e474]
                          - img [ref=e477]
                      - generic [ref=e483]: SS
                    - generic [ref=e484]:
                      - heading "Shrishti Sem - COL-0013" [level=5] [ref=e485]
                      - generic "shrishti@collectivsuite.com" [ref=e486]
                      - generic [ref=e488]: Software Developer
                      - generic [ref=e489]: +91 9876534567
                      - generic [ref=e490]:
                        - img [ref=e492]
                        - generic [ref=e494]: Offline
                  - generic [ref=e497] [cursor=pointer]:
                    - generic [ref=e498]:
                      - generic [ref=e500]:
                        - generic [ref=e501]: Absent
                        - generic [ref=e502]:
                          - img [ref=e503]
                          - img [ref=e507]
                          - img [ref=e510]
                      - generic [ref=e516]: SD
                    - generic [ref=e517]:
                      - heading "Sophia Devis - COL-0020" [level=5] [ref=e518]
                      - generic "sadiya.qamar+sophia@techsuperiors.com" [ref=e519]
                      - generic [ref=e521]: "-"
                      - generic [ref=e522]: +91 9898393982
                      - generic [ref=e523]:
                        - img [ref=e525]
                        - generic [ref=e527]: Offline
                  - generic [ref=e530] [cursor=pointer]:
                    - generic [ref=e531]:
                      - generic [ref=e533]:
                        - generic [ref=e534]: Absent
                        - generic [ref=e535]:
                          - img [ref=e536]
                          - img [ref=e540]
                          - img [ref=e543]
                      - generic [ref=e549]: R
                    - generic [ref=e550]:
                      - heading "Rupali - COL-0021" [level=5] [ref=e551]
                      - generic "sadiya.qamar+rupali@techsuperiors.com" [ref=e552]
                      - generic [ref=e554]: Human Resources Manager
                      - generic [ref=e555]: +91 9883874834
                      - generic [ref=e556]:
                        - img [ref=e558]
                        - generic [ref=e560]: Offline
                  - generic [ref=e563] [cursor=pointer]:
                    - generic [ref=e564]:
                      - generic [ref=e566]:
                        - generic [ref=e567]: Absent
                        - generic [ref=e568]:
                          - img [ref=e569]
                          - img [ref=e573]
                          - img [ref=e576]
                      - generic [ref=e582]: AK
                    - generic [ref=e583]:
                      - heading "Ankit Kumar - COL-0023" [level=5] [ref=e584]
                      - generic "ankit.kumar@techsuperiors.com" [ref=e585]
                      - generic [ref=e587]: Software Developer
                      - generic [ref=e588]: +91 2343242342
                      - generic [ref=e589]:
                        - img [ref=e591]
                        - generic [ref=e593]: Online
                  - generic [ref=e596] [cursor=pointer]:
                    - generic [ref=e597]:
                      - generic [ref=e599]:
                        - generic [ref=e600]: Absent
                        - generic [ref=e601]:
                          - img [ref=e602]
                          - img [ref=e606]
                          - img [ref=e609]
                      - generic [ref=e615]: AK
                    - generic [ref=e616]:
                      - heading "Ankit Kumar - COL-0024" [level=5] [ref=e617]
                      - generic "ankit.kumar+ankit@techsuperiors.com" [ref=e618]
                      - generic [ref=e620]: Chief Technology Officer
                      - generic [ref=e621]: +91 2343242342
                      - generic [ref=e622]:
                        - img [ref=e624]
                        - generic [ref=e626]: Online
                  - generic [ref=e629] [cursor=pointer]:
                    - generic [ref=e630]:
                      - generic [ref=e632]:
                        - generic [ref=e633]: Absent
                        - generic [ref=e634]:
                          - img [ref=e635]
                          - img [ref=e639]
                          - img [ref=e642]
                      - generic [ref=e648]: KT
                    - generic [ref=e649]:
                      - heading "Kartikey Tripathi - COL-0025" [level=5] [ref=e650]
                      - generic "kartkartikey.santosh@techsuperiors.com" [ref=e651]
                      - generic [ref=e653]: Human Resources Director
                      - generic [ref=e654]: +91 1232313121
                      - generic [ref=e655]:
                        - img [ref=e657]
                        - generic [ref=e659]: Offline
                  - generic [ref=e662] [cursor=pointer]:
                    - generic [ref=e663]:
                      - generic [ref=e665]:
                        - generic [ref=e666]: Absent
                        - generic [ref=e667]:
                          - img [ref=e668]
                          - img [ref=e672]
                          - img [ref=e675]
                      - generic [ref=e681]: NK
                    - generic [ref=e682]:
                      - heading "Nishant Kumar - COL-0008" [level=5] [ref=e683]
                      - generic "nishant.kumar@techsuperiors.com" [ref=e684]
                      - generic [ref=e686]: Human Resources Director
                      - generic [ref=e687]: +91 9876598765
                      - generic [ref=e688]:
                        - img [ref=e690]
                        - generic [ref=e692]: Offline
                  - generic [ref=e695] [cursor=pointer]:
                    - generic [ref=e696]:
                      - generic [ref=e698]:
                        - generic [ref=e699]: Absent
                        - generic [ref=e700]:
                          - img [ref=e701]
                          - img [ref=e705]
                          - img [ref=e708]
                      - generic [ref=e714]: AK
                    - generic [ref=e715]:
                      - heading "Ajay Kumar - COL-0011" [level=5] [ref=e716]
                      - generic "ajay.gupta@techsuperiors.com" [ref=e717]
                      - generic [ref=e719]: Cybersecurity Analyst
                      - generic "Phone number missing" [ref=e720]:
                        - img [ref=e721]
                      - generic [ref=e723]:
                        - img [ref=e725]
                        - generic [ref=e727]: Offline
                  - generic [ref=e730] [cursor=pointer]:
                    - generic [ref=e731]:
                      - generic [ref=e733]:
                        - generic [ref=e734]: Absent
                        - generic [ref=e735]:
                          - img [ref=e736]
                          - img [ref=e740]
                          - img [ref=e743]
                      - img [ref=e751]
                    - generic [ref=e752]:
                      - heading "Priyanka Rautela - COL-0015" [level=5] [ref=e753]
                      - generic "priyanka.rautela@techsuperiors.com" [ref=e754]
                      - generic [ref=e756]: Chief Technology Officer
                      - generic [ref=e757]: +91 9882387823
                      - generic [ref=e758]:
                        - img [ref=e760]
                        - generic [ref=e762]: Offline
                  - generic [ref=e765] [cursor=pointer]:
                    - generic [ref=e766]:
                      - generic [ref=e768]:
                        - generic [ref=e769]: WFH
                        - generic [ref=e770]:
                          - img [ref=e771]
                          - img [ref=e775]
                          - img [ref=e778]
                      - generic [ref=e784]: PC
                    - generic [ref=e785]:
                      - heading "Palak Chourasia - COL-0019" [level=5] [ref=e786]
                      - generic "palak.chourasia@techsuperiors.com" [ref=e787]
                      - generic [ref=e789]: Financial Controller
                      - generic [ref=e790]: +91 8765456534
                      - generic [ref=e791]:
                        - img [ref=e793]
                        - generic [ref=e795]: Online
                  - generic [ref=e796]:
                    - generic [ref=e798]:
                      - text: Showing
                      - strong [ref=e799]: 1–16
                      - text: of
                      - strong [ref=e800]: "247"
                      - text: records
                    - list [ref=e801]:
                      - listitem [ref=e802]:
                        - generic [ref=e803]: Previous
                      - listitem [ref=e804] [cursor=pointer]:
                        - generic [ref=e805]: "1"
                      - listitem [ref=e806] [cursor=pointer]:
                        - generic [ref=e807]: "2"
                      - listitem [ref=e808] [cursor=pointer]:
                        - generic [ref=e809]: "3"
                      - listitem [ref=e810] [cursor=pointer]:
                        - generic [ref=e811]: "4"
                      - listitem [ref=e812] [cursor=pointer]:
                        - generic [ref=e813]: "5"
                      - listitem [ref=e814] [cursor=pointer]:
                        - generic [ref=e816]:
                          - img "double-right" [ref=e817]:
                            - img [ref=e818]
                          - generic [ref=e820]: •••
                      - listitem [ref=e821] [cursor=pointer]:
                        - generic [ref=e822]: "16"
                      - listitem [ref=e823] [cursor=pointer]:
                        - generic [ref=e824]: Next
                      - listitem [ref=e825]:
                        - generic "Page Size" [ref=e826] [cursor=pointer]:
                          - generic [ref=e828]:
                            - combobox "Page Size" [ref=e830]
                            - generic "16 / page" [ref=e831]
                          - generic:
                            - img:
                              - img
            - generic [ref=e833]:
              - generic [ref=e834]:
                - generic [ref=e835]: S
                - img [ref=e838]
                - generic [ref=e840]:
                  - text: Messaging
                  - generic [ref=e842]: "0"
              - img [ref=e844] [cursor=pointer]
  - alert [ref=e846]
  - dialog "Add Employee" [ref=e848]:
    - generic [ref=e849]:
      - generic [ref=e852]: Add Employee
      - img [ref=e855] [cursor=pointer]
    - generic [ref=e858]:
      - generic [ref=e860]:
        - generic [ref=e861]:
          - generic [ref=e865]:
            - generic [ref=e866]: Personal Details
            - generic [ref=e867]: Step 1
          - generic [ref=e872]:
            - generic [ref=e873]: Work Detail
            - generic [ref=e874]: Step 2
          - generic [ref=e879]:
            - generic [ref=e880]: Policy Settings
            - generic [ref=e881]: Step 3
          - generic [ref=e886]:
            - generic [ref=e887]: Upload Document
            - generic [ref=e888]: Step 4
          - generic [ref=e893]:
            - generic [ref=e894]: Finance Details
            - generic [ref=e895]: Step 5
        - generic [ref=e898]:
          - generic [ref=e899]:
            - generic [ref=e902]:
              - generic [ref=e904]:
                - text: "*"
                - generic [ref=e905]: First Name
              - textbox "* First Name" [ref=e909]:
                - /placeholder: Enter First Name
                - text: Test
            - generic [ref=e912]:
              - generic [ref=e915]: Middle Name
              - textbox "Middle Name" [ref=e919]:
                - /placeholder: Enter Middle Name
                - text: Edge
            - generic [ref=e922]:
              - generic [ref=e925]: Last Name
              - textbox "Last Name" [ref=e929]:
                - /placeholder: Enter Last Name
                - text: Case
          - generic [ref=e930]:
            - generic [ref=e933]:
              - generic [ref=e935]:
                - text: "*"
                - generic [ref=e936]: Date of Birth
              - generic [ref=e941]:
                - textbox "* Date of Birth" [ref=e942]:
                  - /placeholder: Select date
                  - text: 2000-01-01
                - generic:
                  - img "calendar":
                    - img
                - button "close-circle" [ref=e943] [cursor=pointer]:
                  - img "close-circle" [ref=e944]:
                    - img [ref=e945]
            - generic [ref=e949]:
              - generic [ref=e951]:
                - text: "*"
                - generic [ref=e952]: Gender
              - generic [ref=e956] [cursor=pointer]:
                - generic [ref=e958]:
                  - combobox "* Gender" [ref=e960]
                  - generic [ref=e961]: Other
                - generic:
                  - img
            - generic [ref=e964]:
              - generic [ref=e966]:
                - text: "*"
                - generic [ref=e967]: Marital Status
              - generic [ref=e971] [cursor=pointer]:
                - generic [ref=e973]:
                  - combobox "* Marital Status" [ref=e975]
                  - generic [ref=e976]: Unmarried
                - generic:
                  - img
          - generic [ref=e977]:
            - generic [ref=e980]:
              - generic [ref=e983]: Phone
              - generic [ref=e987]:
                - textbox "1 (702) 123-4567" [ref=e988]: "+91"
                - 'button "India: + 91" [ref=e990] [cursor=pointer]'
            - generic [ref=e995]:
              - generic [ref=e997]:
                - text: "*"
                - generic [ref=e998]: Employee Series
              - generic [ref=e999]:
                - generic [ref=e1002] [cursor=pointer]:
                  - generic [ref=e1004]:
                    - combobox "* Employee Series" [ref=e1006]
                    - generic: Select Series
                  - generic:
                    - img
                - generic [ref=e1009]:
                  - img [ref=e1010]
                  - generic [ref=e1013]: Please select series.
            - generic [ref=e1016]:
              - generic [ref=e1019]: Employee ID
              - textbox "Employee ID" [disabled] [ref=e1023]:
                - /placeholder: Generated Employee ID
                - text: COL-0034
          - generic [ref=e1024]:
            - generic [ref=e1027]:
              - generic [ref=e1029]:
                - text: "*"
                - generic [ref=e1030]: Joining Date
              - generic [ref=e1035]:
                - textbox "* Joining Date" [ref=e1036]:
                  - /placeholder: Select date
                  - text: 2008-04-28
                - generic:
                  - img "calendar":
                    - img
                - button "close-circle" [ref=e1037] [cursor=pointer]:
                  - img "close-circle" [ref=e1038]:
                    - img [ref=e1039]
            - generic [ref=e1043]:
              - generic "Skills" [ref=e1045]
              - generic [ref=e1049] [cursor=pointer]:
                - generic [ref=e1052]:
                  - generic "Python" [ref=e1054]:
                    - generic [ref=e1055]: Python
                    - img [ref=e1057]:
                      - img [ref=e1058]
                  - combobox "Skills" [ref=e1062]
                - generic:
                  - img
      - generic [ref=e1064]:
        - button "Cancel" [ref=e1065] [cursor=pointer]:
          - generic [ref=e1066]: Cancel
        - button "Next" [active] [ref=e1067] [cursor=pointer]:
          - generic [ref=e1068]: Next
```

# Test source

```ts
  1   | const { classify } = require("../utils/dataClassifier");
  2   | 
  3   | class FormEngine {
  4   |   constructor(page, ctx) {
  5   |     this.page = page;
  6   |     this.ctx = ctx;
  7   |     this.fields = {};
  8   |   }
  9   | 
  10  |   registerFields(fields) {
  11  |     this.fields = { ...this.fields, ...fields };
  12  |   }
  13  | 
  14  |   locator(selector) {
  15  |     return this.page.locator(selector);
  16  |   }
  17  | 
  18  |   async fill(fieldKey, value) {
  19  |     const field = this.fields[fieldKey];
  20  |     if (!field) {
  21  |       throw new Error(
  22  |         `Field "${fieldKey}" is not registered. Did you call registerFields()?`
  23  |       );
  24  |     }
  25  | 
  26  |     const { selector, group } = field;
  27  | 
  28  |     try {
  29  |       const isProvided = value !== undefined && value !== null && value !== "";
  30  |       let effectiveValue;
  31  | 
  32  |       if (!isProvided) {
  33  |         effectiveValue = await this.page.locator(selector).inputValue();
  34  |         this.ctx.fallback[fieldKey] = effectiveValue;
  35  |       } else {
  36  |         await this.page.locator(selector).fill(String(value));
  37  |         effectiveValue = value;
  38  |       }
  39  | 
  40  |       this.ctx.setInput(group, fieldKey, effectiveValue);
  41  |       this.ctx.setFinal(fieldKey, effectiveValue);
  42  |       this.ctx.setGenerated(fieldKey, classify(effectiveValue, isProvided));
  43  | 
  44  |     } catch (err) {
  45  |       this.ctx.log(`fill [${fieldKey}]: ${err.message}`, "error");
> 46  |       throw new Error(`fill "${fieldKey}" failed: ${err.message}`);
      |             ^ Error: Step 2 fill failed: fill "workEmail" failed: locator.fill: Timeout 15000ms exceeded.
  47  |     }
  48  |   }
  49  | 
  50  |   async click(selector) {
  51  |     try {
  52  |       await this.page.locator(selector).click();
  53  |     } catch (err) {
  54  |       throw new Error(`click "${selector}" failed: ${err.message}`);
  55  |     }
  56  |   }
  57  | 
  58  |   async type(selector, value) {
  59  |     if (!value) return;
  60  |     try {
  61  |       const input = this.page.locator(selector);
  62  |       await input.fill("");
  63  |       await input.type(value);
  64  |     } catch (err) {
  65  |       throw new Error(`type "${selector}" failed: ${err.message}`);
  66  |     }
  67  |   }
  68  | 
  69  |   async press(key) {
  70  |     try {
  71  |       await this.page.keyboard.press(key);
  72  |     } catch (err) {
  73  |       throw new Error(`press "${key}" failed: ${err.message}`);
  74  |     }
  75  |   }
  76  | 
  77  |   async select(selector, value) {
  78  |     try {
  79  |       await this.page.locator(selector).click();
  80  |       const dropdown = this.page.locator(
  81  |         '[role="listbox"], .ant-select-dropdown'
  82  |       );
  83  |       await dropdown.waitFor({ state: "visible", timeout: 5000 });
  84  |       await this.page
  85  |         .locator('[role="option"]')
  86  |         .filter({ hasText: value })
  87  |         .first()
  88  |         .click();
  89  |     } catch (err) {
  90  |       throw new Error(`select "${selector}" → "${value}" failed: ${err.message}`);
  91  |     }
  92  |   }
  93  | 
  94  |   async pause(ms = 500) {
  95  |     await this.page.waitForTimeout(ms);
  96  |   }
  97  | 
  98  |   async captureToast() {
  99  |     try {
  100 |       const toast = this.page.locator(
  101 |         ".ant-message-notice-content, .ant-notification-notice-message"
  102 |       );
  103 |       const count = await toast.count();
  104 | 
  105 |       for (let i = 0; i < count; i++) {
  106 |         const message = (await toast.nth(i).innerText()).trim();
  107 |         if (!message) continue;
  108 | 
  109 |         // ← deduplicate: don't add same message twice
  110 |         const already = this.ctx.toasts.some((t) => t.message === message);
  111 |         if (!already) {
  112 |           this.ctx.addToast({ message });
  113 |           this.ctx.log(`Toast captured: "${message}"`, "info");
  114 |         }
  115 |       }
  116 | 
  117 |     } catch (err) {
  118 |       this.ctx.log(`captureToast failed: ${err.message}`, "warn");
  119 |       // ← don't re-throw — toast capture is best-effort, shouldn't fail the test
  120 |     }
  121 |   }
  122 | 
  123 |   async captureFieldErrors() {
  124 |     try {
  125 |       const errors = this.page.locator(".ant-form-item-explain-error"); // ← was this.form.page (bug)
  126 |       const count = await errors.count();
  127 | 
  128 |       for (let i = 0; i < count; i++) {
  129 |         const msg = (await errors.nth(i).innerText()).trim();
  130 |         if (!msg) continue;
  131 | 
  132 |         const fieldContainer = errors
  133 |           .nth(i)
  134 |           .locator('xpath=ancestor::div[contains(@class,"ant-form-item")]');
  135 | 
  136 |         const label = await fieldContainer
  137 |           .locator("label")
  138 |           .first()
  139 |           .innerText()
  140 |           .catch(() => "unknown");
  141 | 
  142 |         // ← deduplicate: don't add same field+message twice
  143 |         const already = this.ctx.fieldErrors.some(
  144 |           (e) => e.field === label && e.message === msg
  145 |         );
  146 |         if (!already) {
```