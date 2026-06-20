function GridRow({label, value}){
    return (
        <div>
            <div className="product__table-row"
            style = {{display: 'flex', justifyContent: 'space-between',
                width: '100%', padding: '10px 5px'}}>
                <strong style={{padding: "5px", backgroundColor: 'darkgrey'}}>{label}:</strong>
                <span>{value}</span>
            </div>
            <hr/>
        </div>
    );
}

export default GridRow