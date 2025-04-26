import InformationRoom from "../../create/page";

interface IProps {
    params: { id: string };
  }

const UpdateRoom = async (props: IProps) => {
    const { params } = props;
    return (
        <div>
            <InformationRoom id={params.id} />
        </div>
    )
}

export default UpdateRoom;