import {Resolvers} from "../../../types/graphql.codegen";
import { PmPoolDividendStatus} from "../../../types/graphql-enums";
import _ from 'lodash'


export const resolvers: Resolvers = {
    PmPool: {
        dividends(PmPool, args) {
            const { dividends } = PmPool
            let rs = dividends || [] as any[]
            if (args.officialOnly) {
                rs = rs.filter(item => item.status === PmPoolDividendStatus.Official)
            } else {
                rs = rs.filter((r) => r.div != 'NotWin')
            }
            return rs
        }
    }
}
