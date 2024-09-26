import { SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";


export const Skeleton = () => {
    
        return (
          <div className='w-full h-screen'>
            <Box padding='6' boxShadow='lg' bg='white' className='w-[100%]  h-[100%]'>
              <SkeletonCircle size='100' />
              <SkeletonText mt='4' noOfLines={20} spacing='4' skeletonHeight='2' />
            </Box>
          </div>
        );
      }
