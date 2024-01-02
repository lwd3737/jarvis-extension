export const createAction = (action: string, payload?: any) => {
	return {
		type: action,
		payload,
	};
};
export const action = createAction;
