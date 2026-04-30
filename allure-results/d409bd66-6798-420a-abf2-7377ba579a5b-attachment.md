# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: createUserProfile.spec.js >> User 3: Rohan Negi
- Location: tests\createUserProfile.spec.js:10:3

# Error details

```
Error: Submit failed: Submit failed — error toast: "User already registered with the same email."
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
                        - generic [ref=e393]: Away
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
                        - generic [ref=e795]: Away
                  - generic [ref=e796]:
                    - generic [ref=e798]:
                      - text: Showing
                      - strong [ref=e799]: 1–16
                      - text: of
                      - strong [ref=e800]: "248"
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
    - generic [ref=e846] [cursor=pointer]:
      - img [ref=e847]
      - generic [ref=e850]: User already registered with the same email.
  - alert [ref=e851]
  - dialog "Add Employee" [ref=e853]:
    - generic [ref=e854]:
      - generic [ref=e857]: Add Employee
      - img [ref=e860] [cursor=pointer]
    - generic [ref=e863]:
      - generic [ref=e865]:
        - generic [ref=e866]:
          - generic [ref=e867]:
            - img [ref=e869]
            - generic [ref=e871]:
              - generic [ref=e872]: Personal Details
              - generic [ref=e873]: Step 1
          - generic [ref=e876]:
            - img [ref=e878]
            - generic [ref=e880]:
              - generic [ref=e881]: Work Detail
              - generic [ref=e882]: Step 2
          - generic [ref=e885]:
            - img [ref=e887]
            - generic [ref=e889]:
              - generic [ref=e890]: Policy Settings
              - generic [ref=e891]: Step 3
          - generic [ref=e894]:
            - img [ref=e896]
            - generic [ref=e898]:
              - generic [ref=e899]: Upload Document
              - generic [ref=e900]: Step 4
          - generic [ref=e906]:
            - generic [ref=e907]: Finance Details
            - generic [ref=e908]: Step 5
        - generic [ref=e912]:
          - generic [ref=e914]:
            - generic [ref=e917]:
              - generic [ref=e920]: Legal Entity
              - generic [ref=e924] [cursor=pointer]:
                - generic [ref=e926]:
                  - combobox "Legal Entity" [ref=e928]
                  - generic [ref=e929]: Test entity 01
                - generic:
                  - img
            - generic [ref=e932]:
              - generic [ref=e935]: Paygroup
              - generic [ref=e939] [cursor=pointer]:
                - generic [ref=e941]:
                  - combobox "Paygroup" [ref=e943]
                  - generic [ref=e944]: test round off
                - generic:
                  - img
            - generic [ref=e947]:
              - generic [ref=e949]:
                - text: "*"
                - generic [ref=e950]: CTC
              - spinbutton "* CTC" [ref=e954]: "15000"
            - generic [ref=e955]:
              - generic [ref=e956]: Bonus
              - generic [ref=e957] [cursor=pointer]:
                - generic [ref=e958]:
                  - text: Approval Based Performance Bonus (% of Gross)
                  - img [ref=e960]
                - generic [ref=e964]:
                  - generic [ref=e965]:
                    - generic [ref=e966]: TYPE
                    - generic [ref=e967]: Fixed
                  - generic [ref=e968]:
                    - generic [ref=e969]: BONUS PERCENT
                    - generic [ref=e970]: 5%
                  - generic [ref=e971]:
                    - generic [ref=e972]: PAYOUT MONTH
                    - generic [ref=e973]: 01-Nov-2026
              - generic [ref=e974] [cursor=pointer]:
                - generic [ref=e975]:
                  - text: Approval Based Performance Bonus (% of Gross)
                  - img [ref=e977]
                - generic [ref=e981]:
                  - generic [ref=e982]:
                    - generic [ref=e983]: TYPE
                    - generic [ref=e984]: Fixed
                  - generic [ref=e985]:
                    - generic [ref=e986]: BONUS PERCENT
                    - generic [ref=e987]: 12%
                  - generic [ref=e988]:
                    - generic [ref=e989]: PAYOUT MONTH
                    - generic [ref=e990]: 01-Dec-2026
              - button "Add Bonus" [ref=e991] [cursor=pointer]:
                - generic [ref=e992]:
                  - img [ref=e993]
                  - text: Add Bonus
            - generic [ref=e994]: Payroll Details
            - generic [ref=e995]:
              - generic [ref=e996]:
                - generic [ref=e998] [cursor=pointer]:
                  - checkbox "Provident Fund (PF) eligible" [checked] [ref=e1000]
                  - generic [ref=e1002]: Provident Fund (PF) eligible
                - generic [ref=e1004] [cursor=pointer]:
                  - checkbox "ESI eligible" [ref=e1006]
                  - generic [ref=e1008]: ESI eligible
                - generic [ref=e1010] [cursor=pointer]:
                  - checkbox "LWF eligible" [checked] [ref=e1012]
                  - generic [ref=e1014]: LWF eligible
              - generic [ref=e1019]:
                - generic [ref=e1022]: Tax Regime to Consider
                - generic [ref=e1026] [cursor=pointer]:
                  - generic [ref=e1028]:
                    - combobox "Tax Regime to Consider" [ref=e1030]
                    - generic "Old Regime" [ref=e1031]
                  - generic:
                    - img
          - generic [ref=e1037]:
            - generic [ref=e1038]:
              - generic [ref=e1039]: Salary Breakup
              - generic [ref=e1040]:
                - generic [ref=e1041]:
                  - text: Salary Effective from
                  - generic [ref=e1042]: (24-Apr-2025)
                - generic [ref=e1043]:
                  - switch [ref=e1044] [cursor=pointer]
                  - generic [ref=e1047]: Detailed Breakup
            - generic [ref=e1048]:
              - generic [ref=e1049]:
                - generic [ref=e1050]: Regular Salary
                - generic [ref=e1051]: INR 15000
              - img [ref=e1053]
              - generic [ref=e1054]:
                - generic [ref=e1055]: Bonus
                - generic [ref=e1056]: INR 2550
              - generic [ref=e1057]: =
              - generic [ref=e1058]:
                - generic [ref=e1059]: Total
                - generic [ref=e1060]: INR 12450
      - generic [ref=e1062]:
        - button "Previous" [ref=e1063] [cursor=pointer]:
          - generic [ref=e1064]: Previous
        - button "Create" [ref=e1065] [cursor=pointer]:
          - generic [ref=e1066]: Create
  - generic [ref=e1067]:
    - dialog:
      - generic [ref=e1068]:
        - button "Close" [ref=e1069] [cursor=pointer]:
          - generic "Close" [ref=e1070]:
            - img "close" [ref=e1071]:
              - img [ref=e1072]
        - generic [ref=e1075]:
          - img "icon" [ref=e1077]
          - generic [ref=e1078]:
            - heading "Confirm Onboarding Email" [level=5] [ref=e1079]
            - paragraph [ref=e1080]: You are about to create a new employee profile. Would you like to send an onboarding email to the employee?
            - generic [ref=e1081] [cursor=pointer]:
              - checkbox "Send Onboarding Email" [checked] [ref=e1083]
              - generic [ref=e1085]: Send Onboarding Email
            - generic [ref=e1086]:
              - button "Cancel" [ref=e1087] [cursor=pointer]:
                - generic [ref=e1088]: Cancel
              - button "loading Confirm" [active] [ref=e1089] [cursor=pointer]:
                - generic:
                  - img "loading"
                - generic [ref=e1090]: Confirm
```

# Test source

```ts
  1   | // src/utils/ErrorCapture.js
  2   | 
  3   | class ErrorCapture {
  4   |   constructor(page, ctx) {
  5   |     this.page = page;
  6   |     this.ctx  = ctx;
  7   |   }
  8   | 
  9   |   // ─────────────────────────────────────────────────────────────
  10  |   // assertNoErrors — call at end of each step's "assert no UI errors"
  11  |   // ─────────────────────────────────────────────────────────────
  12  |   // Only reports errors that appeared DURING this step (delta-based).
  13  |   // Pushes to ctx for Allure/report, then throws one descriptive error.
  14  |   // Other steps and other user tests are NOT affected.
  15  | 
  16  |   async assertNoErrors(expect, stepLabel = "?") {
  17  |     await this.page.waitForTimeout(300); // let React flush validation state
  18  | 
  19  |     const toastsBefore    = this.ctx.toasts.length;
  20  |     const fieldErrsBefore = this.ctx.fieldErrors.length;
  21  | 
  22  |     await this._captureErrorToasts(stepLabel);
  23  |     await this._captureFieldErrors(stepLabel);
  24  | 
  25  |     const newToasts    = this.ctx.toasts.slice(toastsBefore);
  26  |     const newFieldErrs = this.ctx.fieldErrors.slice(fieldErrsBefore);
  27  | 
  28  |     if (newToasts.length === 0 && newFieldErrs.length === 0) return;
  29  | 
  30  |     const lines = [`[${stepLabel}] UI errors detected:`];
  31  |     newToasts.forEach(t    => lines.push(`  Toast: "${t.message}"`));
  32  |     newFieldErrs.forEach(e => lines.push(`  Field "${e.field}": "${e.message}"`));
  33  | 
  34  |     throw new Error(lines.join("\n"));
  35  |   }
  36  | 
  37  |   // ─────────────────────────────────────────────────────────────
  38  |   // waitForSuccessToast — call after submit + modal confirm
  39  |   // ─────────────────────────────────────────────────────────────
  40  |   // Polls every 400ms until timeout.
  41  |   //   • .custom_toast_css (red) appears     → capture + hard fail IMMEDIATELY
  42  |   //   • .custom_toast_css_success with correct text → sets ctx + returns msg
  43  |   //   • .custom_toast_css_success with wrong text   → hard fail
  44  |   //   • timeout expires                             → hard fail
  45  | 
  46  |   async waitForSuccessToast(timeout = 15_000) {
  47  |     const deadline = Date.now() + timeout;
  48  | 
  49  |     while (Date.now() < deadline) {
  50  |       // Fast-fail: error toast appeared
  51  |       const errToast = this.page.locator(".custom_toast_css");
  52  |       if (await errToast.count() > 0) {
  53  |         const msg = (await errToast.first().innerText()).trim();
  54  |         this.ctx.addToast({ message: msg, type: "error" });
  55  |         this.ctx.log(`Submit error toast: "${msg}"`, "error");
> 56  |         throw new Error(`Submit failed — error toast: "${msg}"`);
      |               ^ Error: Submit failed: Submit failed — error toast: "User already registered with the same email."
  57  |       }
  58  | 
  59  |       // Success path
  60  |       const okToast = this.page.locator(".custom_toast_css_success");
  61  |       if (await okToast.count() > 0) {
  62  |         const msg = (await okToast.first().innerText()).trim();
  63  | 
  64  |         if (msg.includes("Employee profile created successfully")) {
  65  |           this.ctx.setGenerated("successToast", msg);
  66  |           this.ctx.log(`Success toast confirmed: "${msg}"`, "info");
  67  |           return msg;
  68  |         }
  69  | 
  70  |         // Success-styled but wrong text
  71  |         this.ctx.addToast({ message: msg, type: "warning" });
  72  |         throw new Error(`Unexpected toast after submit: "${msg}"`);
  73  |       }
  74  | 
  75  |       await this.page.waitForTimeout(400);
  76  |     }
  77  | 
  78  |     // Timed out
  79  |     await this._captureErrorToasts("Submit");
  80  |     const captured = this.ctx.toasts.map(t => `"${t.message}"`).join(", ");
  81  |     throw new Error(
  82  |       `Success toast never appeared within ${timeout}ms.` +
  83  |       (captured ? ` Error toasts: ${captured}` : " No toasts visible.")
  84  |     );
  85  |   }
  86  | 
  87  |   // ─────────────────────────────────────────────────────────────
  88  |   // PRIVATE HELPERS
  89  |   // ─────────────────────────────────────────────────────────────
  90  | 
  91  |   async _captureErrorToasts(stepLabel) {
  92  |     const els   = this.page.locator(".custom_toast_css");  // red error variant
  93  |     const count = await els.count();
  94  | 
  95  |     for (let i = 0; i < count; i++) {
  96  |       const message = (await els.nth(i).innerText()).trim();
  97  |       if (!message) continue;
  98  |       if (this.ctx.toasts.some(t => t.message === message)) continue; // dedupe
  99  | 
  100 |       this.ctx.addToast({ message, type: "error" });
  101 |       this.ctx.log(`[${stepLabel}] Error toast: "${message}"`, "error");
  102 |     }
  103 |   }
  104 | 
  105 |   async _captureFieldErrors(stepLabel) {
  106 |     const els   = this.page.locator(".ant-form-item-explain-error");
  107 |     const count = await els.count();
  108 | 
  109 |     for (let i = 0; i < count; i++) {
  110 |       const el      = els.nth(i);
  111 |       const message = (await el.innerText()).trim();
  112 |       if (!message) continue;
  113 | 
  114 |       // Walk up to the help div — its id encodes the field name
  115 |       // e.g. id="employeeForm_first_name_help" → field = "first_name"
  116 |       const helpDiv = el.locator('xpath=ancestor::div[contains(@id,"_help")]');
  117 |       let field = "unknown";
  118 |       if (await helpDiv.count() > 0) {
  119 |         const id = await helpDiv.first().getAttribute("id");
  120 |         field = id?.replace("employeeForm_", "").replace("_help", "") ?? "unknown";
  121 |       }
  122 | 
  123 |       if (this.ctx.fieldErrors.some(e => e.field === field && e.message === message)) continue; // dedupe
  124 | 
  125 |       this.ctx.addFieldError({ field, message });
  126 |       this.ctx.log(`[${stepLabel}] Field error — "${field}": "${message}"`, "error");
  127 |     }
  128 |   }
  129 | }
  130 | 
  131 | module.exports = { ErrorCapture };
```