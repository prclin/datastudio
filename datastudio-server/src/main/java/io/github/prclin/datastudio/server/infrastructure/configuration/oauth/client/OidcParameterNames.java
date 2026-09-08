package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;


public final class OidcParameterNames {

    /**
     * {@code grant_type} - used in Access Jwt Request.
     */
    public static final String GRANT_TYPE = "grant_type";

    /**
     * {@code response_type} - used in Authorization Request.
     */
    public static final String RESPONSE_TYPE = "response_type";

    /**
     * {@code client_id} - used in Authorization Request and Access Jwt Request.
     */
    public static final String CLIENT_ID = "client_id";

    /**
     * {@code client_secret} - used in Access Jwt Request.
     */
    public static final String CLIENT_SECRET = "client_secret";

    /**
     * {@code client_assertion_type} - used in Access Jwt Request.
     *
     * @since 5.5
     */
    public static final String CLIENT_ASSERTION_TYPE = "client_assertion_type";

    /**
     * {@code client_assertion} - used in Access Jwt Request.
     *
     * @since 5.5
     */
    public static final String CLIENT_ASSERTION = "client_assertion";

    /**
     * {@code assertion} - used in Access Jwt Request.
     *
     * @since 5.5
     */
    public static final String ASSERTION = "assertion";

    /**
     * {@code redirect_uri} - used in Authorization Request and Access Jwt Request.
     */
    public static final String REDIRECT_URI = "redirect_uri";

    /**
     * {@code scope} - used in Authorization Request, Authorization Response, Access Jwt Request and Access Jwt
     * Response.
     */
    public static final String SCOPE = "scope";

    /**
     * {@code state} - used in Authorization Request and Authorization Response.
     */
    public static final String STATE = "state";

    /**
     * {@code code} - used in Authorization Response and Access Jwt Request.
     */
    public static final String CODE = "code";

    /**
     * {@code access_token} - used in Authorization Response and Access Jwt Response.
     */
    public static final String ACCESS_TOKEN = "access_token";

    /**
     * {@code token_type} - used in Authorization Response and Access Jwt Response.
     */
    public static final String TOKEN_TYPE = "token_type";

    /**
     * {@code expires_in} - used in Authorization Response and Access Jwt Response.
     */
    public static final String EXPIRES_IN = "expires_in";

    /**
     * {@code refresh_token} - used in Access Jwt Request and Access Jwt Response.
     */
    public static final String REFRESH_TOKEN = "refresh_token";

    /**
     * {@code error} - used in Authorization Response and Access Jwt Response.
     */
    public static final String ERROR = "error";

    /**
     * {@code error_description} - used in Authorization Response and Access Jwt Response.
     */
    public static final String ERROR_DESCRIPTION = "error_description";

    /**
     * {@code error_uri} - used in Authorization Response and Access Jwt Response.
     */
    public static final String ERROR_URI = "error_uri";

    /**
     * Non-standard parameter (used internally).
     */
    public static final String REGISTRATION_ID = "registration_id";

    /**
     * {@code token} - used in Jwt Revocation Request.
     *
     * @since 5.5
     */
    public static final String TOKEN = "token";

    /**
     * {@code token_type_hint} - used in Jwt Revocation Request.
     *
     * @since 5.5
     */
    public static final String TOKEN_TYPE_HINT = "token_type_hint";

    /**
     * {@code device_code} - used in Device Authorization Response and Device Access Jwt Request.
     *
     * @since 6.1
     */
    public static final String DEVICE_CODE = "device_code";

    /**
     * {@code user_code} - used in Device Authorization Response.
     *
     * @since 6.1
     */
    public static final String USER_CODE = "user_code";

    /**
     * {@code verification_uri} - used in Device Authorization Response.
     *
     * @since 6.1
     */
    public static final String VERIFICATION_URI = "verification_uri";

    /**
     * {@code verification_uri_complete} - used in Device Authorization Response.
     *
     * @since 6.1
     */
    public static final String VERIFICATION_URI_COMPLETE = "verification_uri_complete";

    /**
     * {@code interval} - used in Device Authorization Response.
     *
     * @since 6.1
     */
    public static final String INTERVAL = "interval";

    /**
     * {@code audience} - used in Jwt Exchange Access Jwt Request.
     *
     * @since 6.3
     */
    public static final String AUDIENCE = "audience";

    /**
     * {@code resource} - used in Jwt Exchange Access Jwt Request.
     *
     * @since 6.3
     */
    public static final String RESOURCE = "resource";

    /**
     * {@code requested_token_type} - used in Jwt Exchange Access Jwt Request.
     *
     * @since 6.3
     */
    public static final String REQUESTED_TOKEN_TYPE = "requested_token_type";

    /**
     * {@code issued_token_type} - used in Jwt Exchange Access Jwt Response.
     *
     * @since 6.3
     */
    public static final String ISSUED_TOKEN_TYPE = "issued_token_type";

    /**
     * {@code subject_token} - used in Jwt Exchange Access Jwt Request.
     *
     * @since 6.3
     */
    public static final String SUBJECT_TOKEN = "subject_token";

    /**
     * {@code subject_token_type} - used in Jwt Exchange Access Jwt Request.
     *
     * @since 6.3
     */
    public static final String SUBJECT_TOKEN_TYPE = "subject_token_type";

    /**
     * {@code actor_token} - used in Jwt Exchange Access Jwt Request.
     *
     * @since 6.3
     */
    public static final String ACTOR_TOKEN = "actor_token";

    /**
     * {@code actor_token_type} - used in Jwt Exchange Access Jwt Request.
     *
     * @since 6.3
     */
    public static final String ACTOR_TOKEN_TYPE = "actor_token_type";

    /**
     * {@code request_uri} - used in Pushed Authorization Response and Authorization Request.
     *
     * @since 6.5
     */
    public static final String REQUEST_URI = "request_uri";


    /**
     * {@code id_token} - used in the Access Jwt Response.
     */
    public static final String ID_TOKEN = "id_token";

    /**
     * {@code nonce} - used in the Authentication Request.
     */
    public static final String NONCE = "nonce";

    /**
     * {@code code_challenge} - used in Authorization Request.
     */
    public static final String CODE_CHALLENGE = "code_challenge";

    /**
     * {@code code_challenge_method} - used in Authorization Request.
     */
    public static final String CODE_CHALLENGE_METHOD = "code_challenge_method";

    /**
     * {@code code_verifier} - used in Jwt Request.
     */
    public static final String CODE_VERIFIER = "code_verifier";

    private OidcParameterNames() {
    }

}
