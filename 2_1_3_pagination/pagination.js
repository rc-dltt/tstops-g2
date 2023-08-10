import { gql } from 'graphql-tag';

const allRaceQuery = gql`
  query races {
    races(
        first:5
        offset:10
    ){
      id
      no
      startTime
      venue
    }
  }
`;

const allHorseQuery = gql`
  query horses {
    horses {
        id
        name
        rank
      }
    }
`;

