# URL Parsing

Users will be able to add dynamic values in the URL. For example: `https://domain.com/users/{query.id}/resources` and the expectation would be that we'd switch out `{query.id}` for the actual value.

## Supported objects:

-   `parameters`
    -   This is the value passed into the query fields to initialize the fetch. Query should be autofilled via URL params.
    -   Made available via the `request.parameters` object in Request configurations
    -   Note: using `row` as a value in a `get` `Request.uri` will not work, because there is no data available yet.
-   `row`
    -   The data from the currently selected row. If the data is not visisble, it won't be accessible.

## Usage

Using a variable in your URL string must consist of two parts. First, a supported object from above. Second, a key made available.

### Valid Configurations:

-   `https://example.com/resources/{parameters.id}`
-   `https://example.com/resources/{row.title}`
-   `https://example.com/resources/{parameters.resource}/{row.slug}`

### Invalid Configurations:

-   `https://example.com/resouces/{{ parameters.id }}`
-   `https://example.com/resouces/{ parameters.id }`
-   `https://example.com/resouces/${ parameters.id }`
-   `https://example.com/resouces/${parameters.id}`
-   `https://example.com/resouces/{object.id}`
-   `https://example.com/resouces/{{row.id}}`
