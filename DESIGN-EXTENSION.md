### Some Use Cases
1. I want to view food trucks, near me, for particular cuisines, that are open at the current date and current time
2. Show me the Map location for a Food Truck I like
3. Does this Food Truck have any coupons I can use?

4. Near Future: Improve my food truck recommendations, with my recent choices, preferences, and my friends' choices.

Recording or facilitating Transactions at these Food Trucks, would be out-of-scope, to simplify.

## Architecture Design Considerations
### Possible target Clients
- Mobile IOS
- Mobile Android
- Web
- Voice

For this, Server and each Client should be separate artifacts, to facilitate agility in releases and experimentation.

### MicroServices 

#### Some APIs for the above use cases
1. View Food Trucks: GET /foodtrucks?distance=d&cuisines=[x,y,z]
2. Food truck details: GET /foodtrucks/truckId
3. Save User Preferences: POST /foodtrucks/users/userId
4. Get User Metadata: GET /foodtrucks/users/userId
5. Food Truck Coupons: GET /ftcoupons/truckId
6. Food Truck Recommendations: GET /ftrecommendations/users/userId

To ensure Testability & Idempotent API results, 
only the "Food Truck Recommendations" API's response can change, based on if the user is logged-in.

#### Security:
- HTTPS REST APIs
- Authentication - User Login with Multi-factor
- Authorization - OAuth AppToken in Request Header

#### Scalability:
Identify Metrics, like target traffic volume, etc.

##### Load Balancers / API Gateway
These can be used for routing and throttling high volume traffic.

##### Auto-Scaling
Multi-tenant Multi-region Cloud deployment.
The 3 different microservices above, can be deployed with different AutoScaling configurations, based on request traffic.
The Cloud Regions and Availability Zones can be picked based in initial customer segment. 

##### Distributed Caching
< 500ms API response time.
If the Response is much larger (big data problem), then Distributed Caching can be used to cache and index, the Socrata API results. 
Assumption: Cached Data refreshed once a day.

##### Resilience : Logging & Monitoring
Splunk or other Logging & Monitoring are critical to detect and debug applications issues 
in Production and other development environments. 
Failure mode considerations should be add in the system and UX design.

##### Code Modular Components
Modular code design For Extensibility. The Application Config and Enum constant are kept in different modules.
Filtering and Sorting logic can be changed easily in the Utils, without impacting the CLI or Service layers.

Components: Service layer, App Config, Models/DTOs, Enums, Unit tests 

##### Testing Types
1. Automation for Integration & E2E Testing, for CI/CD
2. Feature Flags and Percentage Roll-out
3. A/B testing

### Client Design Considerations
- Ease of Use. Simplicity in viewing results and reduce information overload
- Fast. < 2sec for user to view any request update. 
- Reduced App State Management, since most use cases are logged-out
- Standardized Component Design library, for consistency across different Clients
