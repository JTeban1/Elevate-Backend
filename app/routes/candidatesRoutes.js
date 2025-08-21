const router = Router();

router.get('/', candidatesController.getAllCandidates);

router.get('/:occupation', candidatesController.getAllCandidatesByOccupation)