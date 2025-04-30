export interface GetQueryInterface {
    userID: string,
    isDeleted: boolean,
    expenseDate?: {
        gte: Date,
        lte: Date,
    },
    amount?: {
        gte?: number,
        lte?: number
    }
}