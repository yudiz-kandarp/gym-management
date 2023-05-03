export default (state = {
    userToken: ''
}, action) => {
    switch (action.type) {
        case 'USER_TOKEN':
            return{
                ...state,
                userToken: action.payload
            }

        default:
            return state
    }
}
