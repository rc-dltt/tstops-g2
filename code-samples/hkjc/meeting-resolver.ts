import {JockeyDetail, Resolvers} from '../../../types/graphql.codegen';
import {unsafe} from '../../../utils/errors';
import {CacheablePmPools} from "../../poollist/cache/poollist-cache";
import {CacheableRaceMeeting} from '../cache/race-meeting-cache';
import {RacingGraphQLContextWithDS} from '../../../server';
import {isLocalMeeting} from "../mapper/xml-meeting-mapper";
import {codeRaceClassCacheDatasource} from "../../coderef/cache/coderef-subelement-cache";
import {Language} from "../../../utils/i18n";
import {MappedPmPool} from '../../../types/mapping';
import { MeetingStatus } from '../../../types/graphql-enums';
import {CacheableJockeyStat} from "../../jockeyStat/cache/jockey-stat-cache";
import {CacheableTrainerStat} from "../../trainerStat/cache/trainer-stat-cache";
import {sortMeeting} from "../provider/race-meeting-provider";
import _ from 'lodash';



const venueArr = ['HV', 'ST', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'];

export const resolvers: Resolvers = {
    Query: {
        meetings: (_root, args, ctx, info) => {
            const {raceMeetingProvider} = ctx.dataSources;
            return unsafe(async () => {
                return await raceMeetingProvider.searchMeetings(args.meetingids, args.dates, args.status);
            });
        },
        raceMeetings: (_root, args, ctx, info) => {
            const notExistIdAndDates = !args.id && !args.date
            const meetingIds: string[] = []
            const dates: string[] = []
            if(args.all == true){
                return unsafe(async () => {
                    return await ctx.dataSources.raceMeetingProvider.getMeetingByDate()
                });
            }

            if(args.rebateCalOnly == true){
                return unsafe(async () => {
                    return await ctx.dataSources.raceMeetingProvider.getRebatCalMeeting(args.date || '', args.venueCode || '')
                });
            }
            if (args.id != null) {
                meetingIds.push(args.id as string);
            }
            if (args.date != null) {
                dates.push(args.date as string);
            }

            return unsafe(async () => {
                const meetings = await ctx.dataSources.raceMeetingProvider.searchMeetings(
                    notExistIdAndDates ? null : meetingIds,
                    notExistIdAndDates ? null : dates,
                    args.status, args.venueCode, args.startDate, args.endDate,
                    args.rebateCalOnly
                )

                return _.uniqBy(meetings, 'id');
            });
        },
        jockeys(jockey, args, ctx) {
            if (!args.id) {
                return unsafe(() => {
                    return ctx.dataSources.jockeyProvider.getAll()
                })
            }

            return unsafe(() => {
                return ctx.dataSources.jockeyProvider.getJockeysById([args.id as string])
            })
        },
        horses(horse, args, ctx) {
            if (!args.id) {
                return unsafe(() => {
                    return ctx.dataSources.horseProvider.getAll()
                })
            }
            return unsafe(() => {
                return ctx.dataSources.horseProvider.getHorsesById([args.id as string])
            })
        },
        trainers(trainer, args, ctx) {
            if (!args.id) {
                return unsafe(() => {
                    return ctx.dataSources.trainerProvider.getAll()
                })
            }
            return unsafe(() => {
                return ctx.dataSources.trainerProvider.getTrainersById([args.id as string])
            })
        },
        jockeyStat(stat, args, ctx): any {
            const {jockeyStatProvider} = ctx.dataSources;
            return unsafe(async () => {
                const jockeyStats = await jockeyStatProvider.getAll();
                return jockeyStats.filter((j) => !j.name_en.includes('---') && !j.name_ch.includes('---')).sort(sortStats)
            });
        },
        trainerStat(stat, args, ctx) {
            const {trainerStatProvider} = ctx.dataSources;
            return unsafe(async () => {
                const trainerStats =  await trainerStatProvider.getAll();
                return trainerStats.sort(sortStats)
            });
        },
        lastMeeting: (_root, args, ctx, infos): any => {
            return unsafe(async () => {
                const isLocalOnly = args.localOnly ? true : false
                return await ctx.dataSources.raceMeetingProvider.getLastMeetings(isLocalOnly)
        })
        }
    },
    RaceMeeting: {
        races(meeting, _args, ctx) {

            let ids = meeting.__races || []
            if (_args.id) {
                ids = [_args.id]
            }
            return unsafe(async () => {
                return (await ctx.dataSources.raceProvider.getRaceById(ids))
                .filter((item) => item?.__parent?.raceMeetingId === meeting.id);
            });
        },
        foPools(meeting, _args, ctx) {
            if (!meeting.__foPools || (meeting.__foPools && meeting.__foPools.length === 0)) {
                return []
            } else {
                return unsafe(async () => {
                    const fools = await ctx.dataSources.raceFoPoolProvider.getPoolsByPoolIds(meeting.__foPools)
                    if (_args.oddsTypes != null && _args.oddsTypes.length > 0) {
                        const output: any[] = [];
                        fools?.forEach((f) => {
                            if (_args.oddsTypes?.includes(f.oddsType)) {
                                output.push(f);
                            }
                        });
                        return output;
                    }
                    return fools?.sort(function(a:any,b:any){return b.instNo - a.instNo})
                })

            }

        },
        pmPools(meeting, args, ctx){
            return unsafe(async () => {
                if (!meeting.__pmPools || (meeting.__pmPools && meeting.__pmPools.length === 0)) {
                    return []
                } else if(args?.oddsTypes){
                    const poolIds: string[] = [];
                    args?.oddsTypes.forEach((_type) => {
                        //console.debug('meeting.__pmPools', )
                        meeting.__pmPools.filter(x => x.includes(meeting.id + _type))
                        .forEach((item) => {
                            poolIds.push(item)
                        });
                    })
                    const filter = {'oddsType': {$in: args?.oddsTypes}, 'id': {$in: poolIds}} as any;
                    if (args.raceNo && args.raceNo > 0) {
                        filter["leg.races"] = args.raceNo;
                    }
                    let filteredPools = await ctx.dataSources.PmPoolsProvider.find(filter);
                    
                    if (args.filters) {
                        filteredPools = filteredPools.filter((pmPool: any) => {
                            for (let idx = 0; idx < (args.filters!.length); idx++) {
                                const val = args.filters![idx] as keyof CacheablePmPools;
                                if (pmPool[val] != null && pmPool[val] != '')
                                    return true;
                            }
                            return false;
                        });

                    }
                    return filteredPools as MappedPmPool[]
                } else {
                    return await ctx.dataSources.PmPoolsProvider.getCachedPmPools(meeting.__pmPools);
                }
            })
        }
    }
}