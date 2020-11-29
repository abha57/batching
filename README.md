# batching
# Batching implementation
# Suppose we have five buttons on a page each is making a different apiCall.
# Now we want to implement batching with same functionality as explained below
# Batch all the buttonclicks for say N seconds. Suppose in these N seconds there were 3 button clicks. Batch these 3 requests and after N seconds
# make these apicalls concurrently and serve the result to respective apicall.
# Note that the initial apicalls implementation should not change much.